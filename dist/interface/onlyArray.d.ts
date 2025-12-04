import { IGeter } from '../fastsaas';
import { AnyObject } from './anyObject';
interface sortFun {
    (obj1: AnyObject, obj2: AnyObject): number;
}
interface checkUpdate {
    (oldData: AnyObject, data: AnyObject): boolean;
}
interface DataFormatFun<Pojo = any> {
    (data: Pojo, oldData?: Pojo): Pojo;
}
interface BeforeUpdate<Pojo = any> {
    /**
     *  对于 oldData 数据, 和更新数据 data 的操作
    */
    (data: Pojo, oldData: Pojo): Pojo;
}
interface isUpdate {
    (data: AnyObject, oldData: AnyObject): boolean;
}
interface OptExcute<Pojo = any> {
    (data: Pojo[], oldData?: Pojo[]): Promise<any>;
}
export interface OnlyArrayIntface<Pojo = any> {
    array?: Pojo[];
    data?: Pojo;
    /**
     * 匹配的条件
     */
    mapFun: IGeter<Pojo>;
    /**
     数据库的查询条件，根据条件查出对比数据
    */
    query?: any;
    /**
     * 查询方法，async 返回查询数组, 比 query 优先级高, 二者存一即可
     */
    finds?: Function;
    /**
     *
     */
    sortFun?: sortFun;
    /**
     * 判断更新的函数
     */
    checkUpdate?: checkUpdate;
    addFun?: DataFormatFun;
    /**
     * array 经过 query 数据筛选根据 mapFun, 经过 updateDataArray 补充
     */
    updateFun?: DataFormatFun;
    /**
     * del 之前的处理函数
     */
    delFun?: DataFormatFun<Pojo>;
    /**
     * 数据更新之前的处理函数
     */
    beforeUpdate?: BeforeUpdate<Pojo>;
    noAdd?: boolean;
    needUpdate?: boolean;
    isUpdate?: isUpdate;
    needDel?: boolean;
    /**
     * 真正执行增加的函数
     */
    adds?: OptExcute<Pojo>;
    /**
     * 真正更新的函数
     */
    updates?: OptExcute<Pojo>;
    /**
     * 真正删除的函数
     */
    dels?: OptExcute<Pojo>;
    afterFun?: Function;
    noLastFind?: boolean;
    noDel?: boolean;
    /**
     * 查询出来的结果会和array对比，将数据库的id传给array中的数组
     */
    needFindId?: boolean;
    /**
     * 去重,会试用mapFun 对array的参数进行去重
     */
    needDistinct?: boolean;
    noSch?: boolean;
}
export {};
