import BaseCache from '../BaseCache';
import FindResult from '../dto/FindResult';
interface RedisMapCacheOpt {
    /**
     * 方法名称
     */
    funName: string;
}
/**
 * 内存cache 和 redis cache 的结合
 */
export default class extends BaseCache {
    private _mapCache;
    private _redisCache;
    private _opt;
    constructor(opt: RedisMapCacheOpt);
    protected _removeCache(keys: any): Promise<void>;
    setInquiry(inquiry: any): void;
    setKey(key: any): this;
    clearCache(): void;
    save(e: any, list: any): Promise<void>;
    /**
     * 仅仅给不需要promise的方法用 不支持
     * @param e
     */
    get(e: any): any;
    /**
     转化后的key值
    */
    find(optArray: any): Promise<FindResult>;
    saveArray(opts: any, array: any): Promise<void>;
    removeCache(opts: any): Promise<void>;
}
export {};
