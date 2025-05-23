/**
 * 有group的查询
 * 
 */
import { ArrayUtil } from './../../../util/ArrayUtil';
import { BeanUtil } from './../../../util/BeanUtil';
import JsonUtil from './../../../util/JsonUtil';

import BaseEsFind from './BaseEsFind'
import Query from './../../query/Query';

function _parse(opt) {
  var array = [];
  var groupCols = opt.groupCols;
  var index = opt.index;
  var data = opt.data;
  var groupCol = groupCols[index];
  var formula = groupCol.acqFormula();


  let buckets = opt.aggs[formula.toString()].buckets;
  for (var bucket of buckets) {
    if (index < groupCols.length - 1) {
      formula = formula.toString();
      var nextData = {
        [formula]: {
          value: bucket.key
        }
      };

      BeanUtil.copy(data, nextData);
      ArrayUtil.addAll(array, _parse({
        aggs: bucket,
        data: nextData,
        index: index + 1,
        groupCols: groupCols
      }));
    } else {
      var row = {};
      row[formula.toString()] = {
        value: bucket.key
      };
      row['count()'] = {
        value: bucket.doc_count
      };
      for (var e in bucket) {
        var obj = bucket[e];
        if (obj.value != null) {
          row[e] = obj;
        }
      }
      BeanUtil.copy(data, row);
      array.push(row);
    }
  }
  return array;
}

function parse(result, groupCols) {
  var aggs = JsonUtil.get(result, ['aggregations']);
  var array = _parse({
    aggs: aggs,
    data: {},
    index: 0,
    groupCols: groupCols
  });
  return array;
}

export default class extends BaseEsFind {
  buildQueryParam(query: Query) {
    var param = super.buildQueryParam(query);
    var array = query.acqGroupCol();
    if (array != null && array.length > 0) {
      if (param.body == null) {
        param.body = {};
      }
      var aggs = param.body;
      for (var col of array) {
        aggs = col.parseEsGroupParam(aggs);
      }
      var ret = JsonUtil.set(aggs, ['aggs'], this._buildAggs(query));
      this._buildHaving(ret, query);
    }
    return param;
  }
  private _buildAggs(query: Query) {
    var ret = {};
    var array = query.acqCol();
    for (var col of array) {
      col.parseEsGroupSchCol(ret);
    }
    return ret;
  }
  private _buildHaving(param, query: Query) {
    var havingCols = query.acqHavingCols();
    if (havingCols != null && havingCols.length > 0) {
      var array = [];
      for (let col of havingCols) {
        var havingStr = col.parseEsHaving(param);
        if (havingStr != null) {
          array.push(havingStr);
        }
      }
      if (array.length > 0) {
        JsonUtil.set(param, ['having', 'bucket_selector', 'script', 'lang'], 'expression');
        JsonUtil.set(param, ['having', 'bucket_selector', 'script', 'inline'], array.join(' && '));
      }
    }
  }

  parseResult(query: Query, result: any) {
    console.log('result', JSON.stringify(result));
    var groupCols = query.acqGroupCol();
    var list = parse(result, groupCols);
    var cols = query.acqCol();
    var array = [];
    if (cols != null && cols.length > 0) {
      for (var row of list) {
        var data = {};
        for (var col of cols) {
          // var formula = col.acqFormula();
          // data[col.getName()] = row[formula.toString()];
          col.parseEsAggResult(data, row);
        }
        array.push(data);
      }
    }
    var orderItems = query.getOrders();
    let orders: any[] = [];
    if (orderItems != null && orderItems.length > 0) {
      for (var order of orderItems) {
        orders.push({
          order: order.getCol(),
          desc: order.getDesc()
        });
      }
      array = ArrayUtil.order(array, orders);
    }
    return array;
  }
}