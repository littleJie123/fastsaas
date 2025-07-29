declare class JsonUtil {
    /**
     * 将两个对象的属性相加
     * @param obj1
     * @param obj2
     * @param cols
     */
    static addObj(obj1: any, obj2: any, cols: string[]): any;
    /**
    * 将两个对象的属性相减
    * @param obj1
    * @param obj2
    * @param cols
    */
    static subObj(obj1: any, obj2: any, cols: string[]): any;
    static parseJson(json: any, opt: any): any;
    private static changeVal;
    private static parseStr;
    /**
     * 为Pojo写的copy方法
     */
    static copyPojo(clazzName: string, srcPojo: any, targetPojo: any): void;
    static adds(obj: any, keys: Array<string>, param: any): any;
    /**
     * 和set 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @param value
     */
    static setByKeys(obj: any, keyStr: string, value: any): void;
    /**
     * 只保留某些字段，支持多级
     * @param obj
     * @param keyStrArray
     * @returns
     */
    static onlyKeys(obj: any, keyStrArray: string[]): any;
    /**
     * 对数组的每个元素进行onlyKeys的操作
     * @param obj
     * @param keyStrArray
     */
    static onlyKeys4List(objs: any[], keyStrArray: string[]): any[];
    /**
     * 和get 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @returns
     */
    static getByKeys(obj: any, keyStr: string): any;
    /**
      把一个值加到数组中
      
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static add(obj: any, keys: Array<string>, param: any): any;
    /**
     设置一个值
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static set(obj: any, keys: Array<string> | string, param: any): any;
    /**
     * 取值
     * @param obj
     * @param keys
     */
    static get(obj: any, keys: string | Array<string>): any;
    static change(changer: IChanger | IChanger[], obj: any): any;
    static reverse(changer: IChanger | IChanger[], obj: any): any;
}
export default JsonUtil;
import IChanger from "./dto/IChanger";
