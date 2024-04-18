import {ArrayUtil} from './../../../../util/ArrayUtil';
import BaseCache from '../BaseCache'
import RedisServer from './../../../../redis/RedisServer';
import FindResult from '../dto/FindResult';

/**
 * 基于redis 的缓存
 */
export default class extends BaseCache{
    acqKeys() {
        return null;
    }
    private _fun:string;
    
    async clearCache(){
        throw new Error('redis cache 不支持这个方法');
    }
    private _acqFun(){
        return this._fun;
    }

    fun(str:string){
        this._fun = str;
    }

    _acqRedisKey(redisKey){
        var fun = this._acqFun();
        if(fun==null)
           fun='';
        var key = 'cache_'+fun+'_' + this._acqKey()+'_'+redisKey;
        return key;
    }

    private getRedisServer():RedisServer{
        let context = this._inquiry.getContext(); 
        return context.get('RedisServer');
    }

    private async _setRedis(array){
        var list = [];
        for(var row of array){
            list.push({
                key:this._acqRedisKey(row.key),
                value:row.value
            });
        }
        
        
        let redisServer = this.getRedisServer();
        await redisServer.mset(list);
        
        for(let row of list){
            redisServer.expire(row.key,this.acqTime());
        }
    }



    async save(e, list){
        await this._setRedis([
            {key:e,value:list}
        ]);

    }

    acqTime(){
        return 15*60;
    }
    async get(e):Promise<any>{
        throw new Error('这个方法不被redis 支持');

    }
    /**
    opt 已经被处理好
    */
    async find(opts):Promise<FindResult>{
        var array = [];
        var retlist = await this.findRedis(opts);
        var list = [];
        for(var i=0;i<opts.length;i++){
            var ret = retlist[i];
            var opt = opts[i];
            if(ret != null){
                ArrayUtil.addAll(array,ret);
            }else{
                list.push(opt);
            }
        }
        return {ret:array,list};
    }
    async findRedis(optArray){ 
        optArray = ArrayUtil.parse(optArray,data=>this._acqRedisKey(data));
        var redisClient = this.getRedisServer();
        var array = await redisClient.mget(optArray);
        let retList = [];
        for(let row of array){
            if(row == null)
                retList.push(row);
            else
                retList.push( this._inquiry.changeDbArray2Pojo(row))
        }
        return retList;
    }


    async saveArray(opts,dbs){
        var inquiry = this._inquiry; 
        var map = ArrayUtil.toMapArray(dbs,data=>inquiry.acqDataCode(data));
        var array = [];
        for(var opt of opts){
            var key = inquiry.acqCode(opt);
            var val = map[key];

            if(val == null)
                val = [];
            array.push({
                key,
                value:val
            });
        }
        await this._setRedis(array);
    }

    async _removeCache(array){
        array = ArrayUtil.parse(array,row=>this._acqRedisKey(row));
        var redisClient = this.getRedisServer()
        await redisClient.del(array);
    }







}