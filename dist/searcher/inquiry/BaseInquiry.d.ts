/**
 * 查询的父类
 * async _findDefDatas(params:Array<any>);//产生查询结果没有时候的默认值
 * async _parseResult(data) //更改查询数据
 */
export default abstract class BaseInquiry {
    protected _opt: any;
    private _cache;
    /**
     * 从数据库查找
     * @param params
     */
    protected abstract _findFromDb(params: any): Promise<any[]>;
    /**
     * 返回数据的字符串化
     */
    abstract acqDataCode(data: any): string;
    /**
     * 返回查询参数的字符串化
     * @param param
     */
    abstract acqCode(param: any): string;
    constructor(opt?: any);
    protected get(key: any): any;
    protected acqSchCols(): any;
    /**
     * 注册的时候设置查询列
     * @param cols
     */
    setSchColsOnReg(cols: any): void;
    acqCache(): BaseCache;
    couldSaveAll(): boolean;
    protected _checkOtherCdt(data: any): boolean;
    /**
     * 清空缓存
     */
    clearCache(): void;
    /**
     * 查询数据
     * @param params:Array|any 查询条件，支持数组或单个
     * @param col:可空。null的话返回整条数据，不为null则返回一个只有该字段的数组
     * 不能改成any[] 会导致老代码编译不通过
     *
     */
    find(params: any, col?: string): Promise<any>;
    protected _addDefData(list: any, opt: any): any;
    protected _findNotOpt(list: any, opt: any): any[];
    protected parseRsult(list: Array<any>): Array<any>;
    /**
     * 返回其他条件
     */
    protected acqOtherCdt(): any;
    /**
     * 返回查询的表名
     */
    getKey(): any;
    setKey(key: string): void;
    getContext(): Context;
    setContext(context: any): void;
    getDao(): Dao;
    changeDbArray2Pojo(datas: any[]): any[];
    /**
     * 能否传入一个数组直接保存
     * 如果需要关联表的则不行
     */
    protected _couldSave(): boolean;
    save(array: any): Promise<boolean>;
    private _save;
    protected _hasFindArray(): boolean;
    protected _parseOpt(params: any): any;
    protected _findArray(params: Array<any>): Promise<Array<any>>;
    saveArray(params: any, dbs: any): Promise<boolean>;
    private _getFromCacheByArray;
    acqDataFromCache(param: any, col?: string): Array<any>;
    /**
     * 仅仅从缓存查找
     * 不建议使用
     * 使用acqDataFromcache
     */
    acqFromCache(params: any): any[];
    removeCache(list: any): Promise<void>;
    one(params: any): Promise<any>;
}
import Context from './../../context/Context';
import Dao from './../../dao/Dao';
import BaseCache from "./cache/BaseCache";
