import { Query, Cdt, OrCdt, AndCdt } from "../fastsaas";

/**
 * 该类和ListControl的buildQuery的写法类似（一摸一样）
 */
export default abstract class QueryBuilder{

  /**
   * 增加排序字段
   *  [{
          order:'sort',desc:'desc'
      }]
   */
  protected _orderArray: { order: string, desc?: 'desc' | 'asc' }[] = null;
  /*
  指定只有_schCols 才产生的查询条件
  */
  protected _schCols: any = null;
  /*
  指定_noSchCols 中不要产生查询条件
  */
  protected _noSchCols: any = null;
  /**
   * 查询 计算符 > <
   * {
   *  begin:'>',
   * end:'<'
   * }
   */
  protected _opMap: any = null;
  /**
   * 查询字段转化map
   * {
   *  begin:'gmt_crete',
   * end:'gmt_create'
   * } 
   */
  protected _colMap: any = null;
  /**
   * 查询值转化的map
   */
  protected _valueMap: { [key: string]: (val: any) => any } = null;
  /**
   * 默认查询类型，可以是Array,结构体{store_id：330108}或者BaseCdt的实例
   * 
   */
  protected _schCdt: any = null;


  /**
   * 通过传入的参数，以及自定义的各项参数产生一个query对象，一个QueryBuilder类可以用在不同的ListControl中，相同的输入产生相同的query。
   * @param param 
   */

  protected _noCdt: boolean = false;

  protected buildCdt(e: string, val): Cdt {
    if (e.substring(0, 1) == '_') return null;
    if (val == null) {
      return null;
    }
    if (this._noCdt)
      return null
    // cdts 为通用查询条件，不受 _schCols / _noSchCols 限制
    if (e == 'cdts') {
      return this.doBuildCdt(e, val);
    }
    if (this._schCols != null) {
      if (typeof this._schCols == 'string')
        this._schCols = [this._schCols];
      if (this._schCols instanceof Array) {
        this._schCols = this._schCols.reduce((map, item) => {
          map[item] = true;
          return map;
        }, {});
      }
      if (this._schCols[e] == null) {
        return null;
      }

    }

    if (this._noSchCols != null) {
      if (typeof this._noSchCols == 'string')
        this._noSchCols = [this._noSchCols];
      if (this._noSchCols instanceof Array) {
        this._noSchCols = this._noSchCols.reduce((map, item) => {
          map[item] = true;
          return map;
        }, {});
      }
      if (this._noSchCols[e]) {
        return null;
      }

    }
    if (e == 'desc' || e == 'orderBy' || e == 'pageNo' || e == 'pageSize') {
      return null;
    }
    return this.doBuildCdt(e, val)
  }

  protected doBuildCdt(e: string, val: any): Cdt {
    if (e == 'cdts') {
      return this.buildCdtItems(val);
    }
    let newVal = this.getSchVal(e, val);
    if (newVal == null) {
      return null
    }
    return new Cdt(
      this.getCol(e),
      newVal,
      this.getOp(e))
  }

  protected buildCdtItems(cdts: any): Cdt {
    if (cdts == null || cdts.array == null || cdts.array.length == 0) {
      return null;
    }
    let arrayCdt = this.createArrayCdt(cdts.op);
    for (let item of cdts.array) {
      let cdt = this.buildCdtItem(item);
      if (cdt != null) {
        arrayCdt.addCdt(cdt);
      }
    }
    return arrayCdt.isValid() ? arrayCdt : null;
  }

  protected buildCdtItem(item: any): Cdt {
    if (item == null) {
      return null;
    }
    let op = item.op;
    if (op == 'or' || op == 'and') {
      if (item.array == null || item.array.length == 0) {
        return null;
      }
      let arrayCdt = this.createArrayCdt(op);
      for (let child of item.array) {
        arrayCdt.addCdt(this.buildCdtItem(child));
      }
      return arrayCdt.isValid() ? arrayCdt : null;
    }
    if (item.col == null || item.value == null) {
      return null;
    }
    let value = item.value;
    if (op == 'like') {
      value = this.formatLikeValue(value);
    }
    return new Cdt(item.col, value, op);
  }

  protected createArrayCdt(op?: string): any {
    if (op == 'and') {
      return new AndCdt();
    }
    return new  OrCdt();
  }

  protected formatLikeValue(value: any): any {
    if (value == null || typeof value != 'string') {
      return value;
    }
    if (value.indexOf('%') >= 0) {
      return value;
    }
    return `%${value}%`;
  }

  /**
   * 产生一个like查询语句
   * @param field 
   * @param val 
   */
  protected like(field, val, onlyLeft?: boolean): Cdt {
    if (val == null || val == '') return null
    if (onlyLeft) {
      return new Cdt(field, val + '%', 'like')
    } else {
      return new Cdt(field, '%' + val + '%', 'like')
    }
  }

  protected getSchVal(e: string, val: any): any {
    if (this._valueMap != null) {
      let func = this._valueMap[e]
      if (func) {
        return func(val)
      }
    }
    return val
  }

  protected getCol(name): string {
    if (this._colMap == null) return name
    var ret = this._colMap[name]
    if (ret == null) ret = name
    return ret
  }

  protected getOp(name) {
    if (this._opMap == null) return null
    return this._opMap[name]
  }

  build(param:any):Query{
    var query = new Query()
    if (param == null) {
      param = {}
    }

    if (param._first != null) {
      query.first(parseInt(param._first as any))
    } else if (param.pageNo != null) {
      let pageNo = parseInt(param.pageNo as any)
      let pageSize = param.pageSize == null ? 20 : parseInt(param.pageSize as any)
      query.first((pageNo - 1) * pageSize)
      query.size(pageSize)
    } else if (param.pageSize != null) {
      query.size(parseInt(param.pageSize as any))
    }

    if (this._orderArray && (param.orderBy == null || param.orderBy == '')) {
      for (var i = 0; i < this._orderArray.length; i++) {
        var item = this._orderArray[i]
        if (item.order != null) {
          query.addOrder(item.order, item.desc)
        } else {
          let itemStr: any = item
          if (typeof itemStr == 'string') {
            query.addOrder(itemStr)
          }
        }
      }
    }
    if (param.orderBy != null) {
      query.order(param.orderBy, param.desc)
    }

    if (this._schCols != null) {
      if (typeof this._schCols == 'string') {
        this._schCols = [this._schCols]
      }
      if (this._schCols instanceof Array) {
        let map: any = {}
        for (let name of this._schCols) {
          map[name] = true
        }
        this._schCols = map
      }
    }
    if (this._noSchCols != null) {
      if (typeof this._noSchCols == 'string') {
        this._noSchCols = [this._noSchCols]
      }
      if (this._noSchCols instanceof Array) {
        let map: any = {}
        for (let name of this._noSchCols) {
          map[name] = true
        }
        this._noSchCols = map
      }
    }

    for (var e in param) {
      if (e.substring(0, 1) == '_') continue
      if (e == 'desc' || e == 'orderBy' || e == 'pageNo' || e == 'pageSize') continue
      if (param[e] == null) continue

      if (this._schCols != null) {
        if (this._schCols[e] == null) {
          continue
        }
      }
      if (this._noSchCols != null) {
        if (this._noSchCols[e]) {
          continue
        }
      }

      let cdt = this.buildCdt(e, param[e])
      if (cdt != null) {
        query.addCdt(cdt)
      }
    }

    if (this._schCdt) {
      if (this._schCdt instanceof Array) {
        for (var cdt of this._schCdt) {
          if (cdt == null) continue
          if (!(cdt.clazz == 'BaseCdt')) {
            if (cdt.col != null) {
              query.addCdt(new Cdt(cdt.col, cdt.value, cdt.op))
            } else {
              query.addCdt(cdt)
            }
          } else {
            query.addCdt(cdt)
          }
        }
      } else {
        if (this._schCdt.clazz == 'BaseCdt') {
          query.addCdt(this._schCdt)
        } else {
          for (var e in this._schCdt) {
            query.addCdt(new Cdt(e, this._schCdt[e]))
          }
        }
      }
    }

    return query
  }
}