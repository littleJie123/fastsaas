export default abstract class BaseCache {
    protected _inquiry: BaseInquiry;
    protected _key: string;
    abstract save(e: string, list: Array<any>): Promise<any>;
    abstract get(e: any): Promise<Array<string>>;
    protected abstract _removeCache(keys: any): Promise<any>;
    abstract clearCache(): any;
    constructor();
    setInquiry(baseInquiry: BaseInquiry): void;
    /**
     * 通过查询的参数删除缓存
     * @param params
     * @returns
     */
    removeCache(params: any): Promise<void>;
    _parseKeyArray(params: any): any[];
    setKey(key: any): void;
    saveArray(opts: any, dbs: any): Promise<void>;
    onlySaveArray(dbs: any): Promise<void>;
    /**
    返回结果
    {
      ret, //从缓存中查出的结果
      list //从缓存中找不到的key值
    }
    */
    find(optArray: any): Promise<FindResult>;
    _find(hasArray: any): Promise<any[]>;
    _acqKey(): any;
}
import BaseInquiry from '../BaseInquiry';
import FindResult from './dto/FindResult';
