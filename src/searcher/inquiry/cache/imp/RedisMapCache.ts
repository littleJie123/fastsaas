import {ArrayUtil} from './../../../../util/ArrayUtil';
import BaseCache from '../BaseCache'
import MapCache from './MapCache'
import RedisCache from './RedisCache'
import FindResult from '../dto/FindResult';
interface RedisMapCacheOpt{
    /**
     * 方法名称
     */
    funName:string; 
}
/**
 * 内存cache 和 redis cache 的结合
 */
export default class extends BaseCache{
    
    
    private _mapCache:MapCache;
    private _redisCache:RedisCache
    private _opt:any;

    constructor(opt:RedisMapCacheOpt){
        super();
        this._opt = opt;
        this._mapCache  = new MapCache();
        this._redisCache = new RedisCache();
        this._redisCache.fun(opt.funName);
    }
    protected async _removeCache(keys: any) {
        this._mapCache.removeCache(keys);
        this._redisCache.removeCache(keys);
    }
    
    setInquiry(inquiry){
        this._mapCache.setInquiry(inquiry);
        this._redisCache.setInquiry(inquiry);
    }
    setKey(key){
        this._mapCache.setKey(key);
        this._redisCache.setKey(key);
        return this;
    }
    clearCache(){
        this._mapCache.clearCache();
        this._redisCache.clearCache();
    }
 

    async save(e, list){
        var mapCache = this._mapCache;
        var redisCache = this._redisCache;
        await mapCache.save(e,list);
        await redisCache.save(e,list);
    }
    /**
     * 仅仅给不需要promise的方法用 不支持
     * @param e 
     */
    get(e):any{
        throw new Error("不支持该方法")
    }

    
    /**
     转化后的key值
    */
    async find(optArray):Promise<FindResult>{
        var mapCache = this._mapCache;
    
        var array = []; 
        var ret = await  mapCache.find(optArray); 
        if(ret.list == null || ret.list.length==0)
            return ret;
        ArrayUtil.addAll(array,ret.ret);
        var redisCache = this._redisCache;
        var redisRet = await redisCache.findRedis(ret.list);
        var noArray = [];
        for(var i=0;i<redisRet.length;i++){
            var retRow = redisRet[i];
            var opt = ret.list[i];
            if(retRow == null){
                noArray.push(opt);
            }else{
                await mapCache.save(opt,retRow);
                ArrayUtil.addAll(array,retRow);
            }
        }
        return {
            ret:array,
            list:noArray
        };

    }
    async saveArray(opts,array){
        await this._mapCache.saveArray(opts,array);
        await this._redisCache.saveArray(opts,array);
    }
    
    async removeCache(opts){
        await this._mapCache.removeCache(opts);
        await this._redisCache.removeCache(opts);
    }
}
