import { ArrayUtil } from "./ArrayUtil";
import JsonUtil from "./JsonUtil";
import NumUtil from "./NumUtil";

export default class {

  /**
   * 克隆一个列表
   * @param array 
   * @param opt 
   * @returns 
   */
  private static cloneList(array: any[], opt: {
    notCheckCols?: string[]
  }): any[] {
    if (array == null) {
      return null;
    }

    let retList: any[] = [];
    for (let row of array) {
      let ret: any = {};
      for (let e in row) {
        if (!e.startsWith('_')) {
          ret[e] = row[e]
        }
      }
      let notCheckCols = opt?.notCheckCols;
      if (notCheckCols != null) {
        for (let col of notCheckCols) {
          JsonUtil.delByKeys(ret, col)
        }
      }
      retList.push(ret)
    }
    return retList;
  }


  static expectEqualArray(array1: any[], array2: any[], opt?: {
    msg?: string,
    notCheckCols?: string[]
  }) {
    let msg = opt?.msg;
    if (array1.length != array2.length) {
      throw new Error(msg ?? '两个数组的长度不等');
    }
    let notCheckCols = opt?.notCheckCols;
    if (notCheckCols != null) {
      array2 = this.cloneList(array2, opt)
    }
    this.expectFindByArray(array1, array2, msg);
  }
  static expectEqualObj(obj1: any, obj2: any, msg?: string) {
    if (msg == null) {
      msg = `检查:期望是${JSON.stringify(obj2)},实际是${JSON.stringify(JsonUtil.inKey(obj1, obj2))}`
    }

    if (!JsonUtil.isEqualObj(obj1, obj2)) {
      throw new Error(msg);
    }
  }
  static expectEqual(value1, value2, msg?: string) {
    if (msg == null) {
      msg = `检查出错：期望是${value2}，实际是${value1}`
    }
    if (NumUtil.isNum(value1) && NumUtil.isNum(value2)) {
      if (!NumUtil.isEq(value1, value2)) {
        throw new Error(msg)
      }
    } else {
      if (value1 != value2) {
        throw new Error(msg);
      }
    }
  }

  static expectFind(array: any[], findObj: any, msg?: string) {
    if (msg == null) {
      msg = `没找到${JSON.stringify(findObj)}的数据`
    }
    let find = false;
    for (let row of array) {
      if (JsonUtil.isEqualObj(row, findObj)) {
        find = true;

        break;
      }
    }
    if (!find) {
      throw new Error(msg);
    }

  }
  static expectFindByArray(array: any[], findObjs: any[], msg?: string) {


    for (let findObj of findObjs) {
      this.expectFind(array, findObj)
    }
  }



  static expectNotFind(array: any[], findObj: any, msg?: string) {
    if (msg == null) {
      msg = `找到了${JSON.stringify(findObj)}的数据，本来觉得应该找不到`
    }
    let row = array.find(function (obj) {
      for (let e in findObj) {
        let val = JsonUtil.getByKeys(obj, e);
        if (val != findObj[e]) {
          return false;
        }
      }
      return true;
    })
    if (row != null) {
      throw new Error(msg);
    }
  }

  static expectNotNull(val: any, msg?: string) {
    if (msg == null) {
      msg = '不能为空的值变成空了'
    }
    if (val == null) {
      throw new Error(msg);
    }
  }
}