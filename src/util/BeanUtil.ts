/*
 * @Author       : kaikai.hou
 * @Email        : kaikai.hou@downtown8.com
 * @Description  : Balabala
 * @Date         : 2020-02-11 10:33:05
 * @LastEditors  : kaikai.hou
 * @LastEditTime : 2020-02-12 11:59:45
 */

import { DateUtil } from './DateUtil'
import { ArrayUtil } from './ArrayUtil'
import { AnyObject } from '../interface'

import _ from 'lodash'
import Bean from './../context/decorator/Bean';
import JsonUtil from './JsonUtil';
import { StrUtil } from './StrUtil';
//返回一个高阶函数
let ParseFunMap = {
  '#d': function (array: any[]) {
    let days = array[0];
    let now = array[1];
    return function (params) {
      let numDays = parseInt(days);
      let today;
      if (now == null || params == null || params[now] == null)
        today = DateUtil.today();
      else {
        today = DateUtil.parse(params[now])
      }
      if (numDays < 0)
        return DateUtil.beforeDay(today, numDays * -1)
      return DateUtil.afterDay(today, numDays);
    }
  }
}
class ParseFun {
  static get(key: string, array: any[]) {
    let createFun = ParseFunMap[key];
    if (createFun == null)
      return null;
    return createFun(array);
  }
}
export class BeanUtil {
  /**
   * 
   * @param obj 
   */
  static keys(obj): Array<string> {
    let keys = [];
    if (obj != null) {
      for (let e in obj) {
        keys.push(e)
      }
    }
    return keys;
  }

  /**
   * 合并两个参数,会产生一个新的对象，map1的属性优先
   * @param map1 
   * @param map2 
   * @param fun 
   */
  static shallowCombine(map1: any, map2: any, fun?: any): any {
    if (map1 == null) map1 = {};
    if (map2 == null) map2 = {};
    if (fun == null) {
      fun = function (d1, d2) {
        return d1
      }
    }
    var map = BeanUtil.shallowClone(map1)
    if (map2 != null) {
      for (var e in map2) {
        if (map[e] == null) {
          map[e] = map2[e]
        } else {
          map[e] = fun(map[e], map2[e])
        }
      }
    }
    return map
  }
  /**
根据param 检查obj
*/
  static check(obj, param) {
    if (obj == null || param == null) return true
    let ret = true
    for (let e in param) {
      if (!BeanUtil.isEq(obj[e], param[e])) {

        ret = false
        break
      }
    }
    return ret
  }

  /**
根据param 检查obj
*/
  static checkIgnore(obj, param) {
    if (obj == null || param == null) return true
    let ret = true
    for (let e in param) {
      if (!BeanUtil.isEq(obj[e], param[e])) {
        if (obj[e] == null && param[e] == '') {
          continue;
        }
        if (obj[e] == '' && param[e] == null) {
          continue;
        }
        ret = false
        break
      }
    }
    return ret
  }

  static isEq(val1, val2) {
    if (val1 == null || val2 == null) return (val1 == val2)
    if ((val1 instanceof Date || val2 instanceof Date)) {
      val1 = DateUtil.parse(val1);
      val2 = DateUtil.parse(val2)
      return val1.getTime() == val2.getTime()
    }
    if ((val1 instanceof Array) && (val2 instanceof Array)) {
      return ArrayUtil.isSame(val1, val2)
    }
    if (!isNaN(val1) && !isNaN(val2)) {
      return Math.abs(val1 - val2) < 0.00001
    }
    if (val1 instanceof Object &&
      val2 instanceof Object) {
      return BeanUtil.isBeanEq(val1, val2);
    }
    return val1 == val2
  }

  static isBeanEq(bean1, bean2) {
    if (bean1 == null || bean2 == null) return false
    return BeanUtil.check(bean1, bean2) && BeanUtil.check(bean2, bean1)
  }

  /**
拷贝对象属性
*/
  static copy(src, target, map?) {
    if (src == null || target == null) {
      return
    }
    if (map != null && map instanceof Array) {
      map = ArrayUtil.toMap(map)
    }
    for (let e in src) {
      let val = src[e]
      if (map == null) {
        if (BeanUtil.isPrim(val)) {
          target[e] = val
        } else {
          target[e] = _.cloneDeep(val)
        }
      } else {
        if (map[e]) {
          if (BeanUtil.isPrim(val)) {
            target[e] = val
          } else {
            target[e] = _.cloneDeep(val)
          }
        }
      }
    }
  }

  // null ,字符串,数字，日期
  static isPrim(obj) {
    if (obj == null) return true
    if (!(obj instanceof Object)) return true
    if (obj instanceof Array) return true
    return (obj instanceof Date)
  }

  /**
 * 合并两个map，map1的数据项优先
 * @param  {[type]} map1 [description]
 * @param  {[type]} map2 [description]
 * @return {[type]}      [description]
 */
  static combine(map1: AnyObject, map2: AnyObject, fun?: Function) {
    if (!map1) map1 = {};
    if (!map2) map2 = {};

    return Object.assign({}, map2, map1)
  }

  static shallowCloneList(list: Array<any>, map?, forbit?: boolean): Array<any> {
    let retArray = [];
    if (map != null && map instanceof Array) {
      map = ArrayUtil.toMap(map)
    }
    for (let row of list) {
      retArray.push(this.shallowClone(row, map, forbit));
    }
    return retArray;

  }

  static shallowClone(obj, map?, forbit?: boolean): any {
    var ret = {};
    if (obj != null) {
      if (map != null && map instanceof Array) {
        map = ArrayUtil.toMap(map)
      }
      function hit(name, obj) {
        if (map == null) return true
        if (map instanceof Function) {
          return map(name, obj)
        }
        var mapRet = map[name]
        if (forbit) {
          mapRet = !mapRet
        }
        return mapRet
      }

      for (var e in obj) {
        if (hit(e, obj))
          ret[e] = obj[e]
      }
    }
    return ret;
  }
  /**
   * 判断相等
   * @param obj1 
   * @param obj2 
   * @param cols 
   */
  static isEqual(obj1, obj2, cols?: Array<string>) {
    if (cols == null) {
      for (var e in obj1) {
        if (obj1[e] !== obj2[e])
          return false;
      }
      return true;
    } else {
      for (let col of cols) {
        if (obj1[col] != obj2[col])
          return false;
      }
      return true;
    }

  }

  static isObject(obj) {
    if (obj == null) {
      return false;
    }
    return (Object.prototype.toString.call(obj) === '[object Object]')
  }
  /**
   * 遍历一个data
   * @param data 
   * @param process 
   */
  static each(data, process) {
    if (data == null)
      return null;
    function fun(val, key?, data?) {
      if (val instanceof Array) {
        for (let i = 0; i < val.length; i++) {
          fun(val[i], i, val)
        }
      } else if (BeanUtil.isObject(val)) {
        for (var e in val) {
          fun(val[e], e, val);
        }
      } else {
        process(data, key, val);
      }
    }
    fun(data);
  }
  /**
   * 遍历一个data
   * @param data 
   * @param process 
   */
  static eachFun(fun): Function {
    return function (obj) {
      BeanUtil.each(obj, fun);
      return obj;
    }
  }

  static get(obj, key: string | Array<string> | Function) {
    if (key == null)
      return obj;
    if (key instanceof Function) {
      return key(obj)
    }
    var ret = []
    if (key instanceof Array) {
      for (var k of key) {
        ret.push(obj[k])

      }
      return ret.join('___');
    } else {
      return obj[key];
    }
  }
  /**
   * 深度转化，和parseJsonFromParam 类似，支持多级
   * @param obj 
   * @param params 
   */
  static deepParseJson(obj, ...params): any {
    if (obj == null)
      return null;
    if (obj instanceof Array) {
      let retList = [];
      for (let row of obj) {
        retList.push(BeanUtil.deepParseJson(row, ...params))
      }
      return retList;
    }
    let objRet = {}
    for (let e in obj) {
      let data = obj[e];
      if ((data instanceof Array) || BeanUtil.isObject(data)) {
        objRet[e] = BeanUtil.deepParseJson(data, ...params)
      } else {
        let val = BeanUtil.changeVal(data, ...params);
        if (val != null)
          objRet[e] = val
      }
    }
    return objRet;

  }

  /**
   * 将一个简单的结构（只有一层）转化
   * @param obj {"姓名":"${name}","年龄":"${age}""}
   * @param params {name1:"方法",age:12}
   */
  static parseJsonFromParam(obj, ...params) {
    if (obj == null)
      return null;

    if (params == null || params.length == 0)
      return obj;
    obj = BeanUtil.shallowClone(obj);
    for (let e in obj) {
      let val = obj[e];
      if (val != null) {
        let paramVal = this.changeVal(val, ...params)

        if (paramVal == null) {
          delete obj[e]
        } else {
          obj[e] = paramVal;
        }
      }
    }
    return obj;
  }

  static pick(row: any, cols: string[]): any {
    let retRow = {};
    for (let col of cols) {
      retRow[col] = row[col]
    }
    return retRow;
  }

  /**
   * 去除某些列
   * @param row 
   * @param cols 
   * @returns 
   */
  static notCols(row: any, cols: string[]): any {
    let retRow = {};
    for (let col in row) {
      if (cols.indexOf(col) == -1) {
        retRow[col] = row[col]
      }
    }
    return retRow;
  }

  /**
   * 去除某些列
   * @param list 
   * @param cols 
   * @returns 
   */
  static notCols4List(list: any[], cols: string[]): any[] {
    let array = [];
    let map = ArrayUtil.toMap(cols);
    for (let data of list) {
      let retRow = {};
      for (let col in data) {
        if (!map[col] && data.hasOwnProperty(col)) {
          retRow[col] = data[col]
        }
      }
      array.push(retRow);
    }
    return array;
  }

  /**
   * 从list中挑选出指定的列
   */
  static pickList(list: any[], cols: string[]): any[] {
    let retList: any[] = [];
    for (let row of list) {
      let retRow = {};
      for (let col of cols) {
        retRow[col] = row[col]
      }
      retList.push(retRow);
    }
    return retList;
  }

  static changeVal(val, ...params) {
    if (params == null || params.length == 0 || val == null)
      return val;


    if (val instanceof Array) {
      let ret = [];

      for (let obj of val) {
        let args = [obj];
        args.push(...params);

        ret.push(BeanUtil.changeVal.apply(BeanUtil, args))
      }
      return ret;
    }
    let strVal = StrUtil.trim(val.toString());
    if (strVal.startsWith('${') && strVal.endsWith('}')) {
      strVal = strVal.substring(2, strVal.length - 1);
      if (strVal.startsWith('#')) {
        if (strVal.indexOf("|") != -1) {
          let vals = strVal.split('|');
          let fun = ParseFun.get(vals[0], [vals[1], vals[2], vals[3], vals[4], vals[5]])
          if (fun) {
            return fun(...params);
          } else {
            return ''
          }
        }
      } else {
        for (let param of params) {
          if (!(param instanceof Array)) {


            let paramVal = JsonUtil.getByKeys(param, strVal)
            if (paramVal != null) {
              return paramVal;
            }
          } else {
            if (param.length == 0) {
              return [];
            }
            let paramVal = ArrayUtil.toArray(param, strVal);
            if (paramVal.length > 0) {
              return paramVal;
            }
          }

        }
        return null;
      }
    }
    return val;
  }

  /**
   * 将obj的其他列删除，只剩下指定的列
   * @param obj 
   * @param cols 
   */
  static onlyCols(obj: any, cols: string[]): any {
    for (let e in obj) {
      if (!cols.includes(e)) {
        delete obj[e]
      }
    }
    return obj;
  }


  /**
   * 设置默认值
   * @param obj 
   * @param def 
   */
  static setDefault<Opt = any>(obj: Opt, def: any): Opt {
    obj = { ...obj }
    for (let e in def) {
      if (obj[e] == null) {
        obj[e] = def[e]
      }
    }
    return obj;
  }
}