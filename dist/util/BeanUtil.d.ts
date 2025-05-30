import { AnyObject } from '../interface';
export declare class BeanUtil {
    /**
     *
     * @param obj
     */
    static keys(obj: any): Array<string>;
    /**
     * 合并两个参数,会产生一个新的对象，map1的属性优先
     * @param map1
     * @param map2
     * @param fun
     */
    static shallowCombine(map1: any, map2: any, fun?: any): any;
    /**
  根据param 检查obj
  */
    static check(obj: any, param: any): boolean;
    /**
  根据param 检查obj
  */
    static checkIgnore(obj: any, param: any): boolean;
    static isEq(val1: any, val2: any): boolean;
    static isBeanEq(bean1: any, bean2: any): boolean;
    /**
  拷贝对象属性
  */
    static copy(src: any, target: any, map?: any): void;
    static isPrim(obj: any): boolean;
    /**
   * 合并两个map，map1的数据项优先
   * @param  {[type]} map1 [description]
   * @param  {[type]} map2 [description]
   * @return {[type]}      [description]
   */
    static combine(map1: AnyObject, map2: AnyObject, fun?: Function): AnyObject;
    static shallowCloneList(list: Array<any>, map?: any, forbit?: boolean): Array<any>;
    static shallowClone(obj: any, map?: any, forbit?: boolean): any;
    /**
     * 判断相等
     * @param obj1
     * @param obj2
     * @param cols
     */
    static isEqual(obj1: any, obj2: any, cols?: Array<string>): boolean;
    static isObject(obj: any): boolean;
    /**
     * 遍历一个data
     * @param data
     * @param process
     */
    static each(data: any, process: any): any;
    /**
     * 遍历一个data
     * @param data
     * @param process
     */
    static eachFun(fun: any): Function;
    static get(obj: any, key: string | Array<string> | Function): any;
    /**
     * 深度转化，和parseJsonFromParam 类似，支持多级
     * @param obj
     * @param params
     */
    static deepParseJson(obj: any, ...params: any[]): any;
    /**
     * 将一个简单的结构（只有一层）转化
     * @param obj {"姓名":"${name}","年龄":"${age}""}
     * @param params {name1:"方法",age:12}
     */
    static parseJsonFromParam(obj: any, ...params: any[]): any;
    static pick(row: any, cols: string[]): any;
    /**
     * 去除某些列
     * @param row
     * @param cols
     * @returns
     */
    static notCols(row: any, cols: string[]): any;
    /**
     * 去除某些列
     * @param list
     * @param cols
     * @returns
     */
    static notCols4List(list: any[], cols: string[]): any[];
    /**
     * 从list中挑选出指定的列
     */
    static pickList(list: any[], cols: string[]): any[];
    static changeVal(val: any, ...params: any[]): any;
    /**
     * 将obj的其他列删除，只剩下指定的列
     * @param obj
     * @param cols
     */
    static onlyCols(obj: any, cols: string[]): any;
    /**
     * 设置默认值
     * @param obj
     * @param def
     */
    static setDefault<Opt = any>(obj: Opt, def: any): Opt;
}
