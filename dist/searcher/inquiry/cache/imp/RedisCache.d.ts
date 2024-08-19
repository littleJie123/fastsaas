import BaseCache from '../BaseCache';
import FindResult from '../dto/FindResult';
/**
 * 基于redis 的缓存
 */
export default class extends BaseCache {
    acqKeys(): any;
    private _fun;
    clearCache(): Promise<void>;
    private _acqFun;
    fun(str: string): void;
    _acqRedisKey(redisKey: any): string;
    private getRedisServer;
    private _setRedis;
    save(e: any, list: any): Promise<void>;
    acqTime(): number;
    get(e: any): Promise<any>;
    /**
    opt 已经被处理好
    */
    find(opts: any): Promise<FindResult>;
    findRedis(optArray: any): Promise<any[]>;
    saveArray(opts: any, dbs: any): Promise<void>;
    _removeCache(array: any): Promise<void>;
}
