import Redis from './Redis'
import IoRedis from 'ioredis'
export default class RedisServer {
    //表示在工厂类里面是单例
    public static __needReg = 'single';
    protected _client:IoRedis.Redis;
    private getClient():IoRedis.Redis {
        if(this._client == null){
            this._client = Redis.get()
        }
        return this._client;
    }
    async lock(key,device_id:string, time?:number) {
        if(time == null)
            time = 300;
        const client = this.getClient()
        const ret = await client.set(key, device_id, 'NX', 'EX', time)

        if (device_id === '') {
            return ret === 'OK'
        }

        if(ret === 'OK'){
            return true
        }else{
            let cacheValue = await client.get(key);
            return cacheValue == device_id;
        }
    }
    async unlock(key,device_id) {
        const script = ['if redis.call("get",KEYS[1]) == ARGV[1] then',
            '	return redis.call("del",KEYS[1])',
            'else',
            '	return 0',
            'end'
        ];
        const client = this.getClient()
        await client.eval(script.join('\r\n'), 1, key, device_id);
    }

    async flushdb(){
        let redis = this.getClient();
        await redis.flushdb();
    }
    async  del(key){
        let redis = this.getClient();
        if(key == null)
            return;
        if(key instanceof Array){
            if(key.length == 0)
                return;
            for(let data of key){ 
                
                await redis.del(data)
            }
        }else{
            await redis.del(key);
        }
        
    }
    async hkeys(key){
        let redis = this.getClient();
        return await redis.hkeys(key);
    }
    async hmset(key,array){
        let redis = this.getClient();
        var fun = redis.hmset;
        var list = [];
        list.push(key);
        for(var row of array){
            list.push(row.key);
            list.push(JSON.stringify(row.value))
        }
        await fun.apply(redis,list)
    }
    async mset(array){

        if(array == null || array.length==0)
            return;
        let redis = this.getClient();
        var fun = redis.mset;
        var list = [];
        for(var row of array){
            list.push(row.key);
            list.push(JSON.stringify(row.value))
        }
        await fun.apply(redis,list)
    }
    
    async mget(array){
        if(array == null  ) return null;
        if(array.length == 0) return []
        let redis = this.getClient();
        var list =  await redis.mget(array);
        var retList = [];
        for(var row of list){
          if(row == null)
            retList.push(row)
          else
            retList.push(JSON.parse(row))
    
        }
        return retList
    }
    
    async hdel(key,... field){
        if(key == null || field==null){
            return false;
        }
        let redis:IoRedis.Redis = this.getClient();
        await redis.hdel(key,field);
    }

    async hvals(key ){
        if(key == null  ){
            return [];
        }
        let redis:IoRedis.Redis = this.getClient();
        let array = await redis.hvals(key);
        for(let i =0;i<array.length;i++){
            try{
                array[i] = JSON.parse(array[i])
            }catch(e){
                
            }
        }
        return array;

    }
    async hget(key,field){
        let redis = this.getClient();
        var obj = await redis.hget(key,field);
        if(obj == null)
          return null
        return JSON.parse(obj);
    }
    async hmget(key,array){
        if(array.length==0)
            return []
        let redis = this.getClient();
        var fun = redis.hmget;
        var list = [];
        list.push(key);
        for(var row of array){
            list.push(row);
        }
        var list = await fun.apply(redis,list)
        array = [];
        for(var row of list){
            if(row == null){
                array.push(row);
            }else{
                array.push(JSON.parse(row));
            }
        }
        return array;
    }
    
    async expire(key,time){
        let redis = this.getClient();
        await redis.expire(key,time);
    }
    
    
    async exists(key){
        let redis = this.getClient();
        return await redis.exists(key);
    }
    
    
    async incr(id:string,exp?:number) {
        if (id == null) {
          id = 'id'
        }
        let redis = this.getClient();
        var ret = await redis.incr(id)
        if(exp!=null)
            this.expire(id,exp);

        return ret
    }  
    
    async id(id) {
        if (id == null) {
          id = 'id'
        }
        let redis = this.getClient();
        var ret = await redis.incr(id)
        return ret
    }
    /**
     * 
     * @param id 
     * @param val 
     * @param second 过期时间秒 
     */
    async set(id, val, second?:number) {
        if (id == null || val == null) {
            return
        }
        if (second == null) {
            second = 300
        }
        
        let redis = this.getClient();
        
        var ret = null;
        try{
            ret = await redis.set(id, JSON.stringify(val), 'ex', second)
        }catch(e){

        }
        
        return ret == 'ok'
    }

    async setNx(id,val,time?:number){
        
    }
    async get(id) {
        
        if (id == null) {
            return
        }
        
        let redis = this.getClient();
        
        var ret ;
        try{
            ret = await redis.get(id)
        }catch(e){
            ret = null;
        }
        
        if (ret == null) return null
        return JSON.parse(ret)
    }

    async get2(id) {
        
        if (id == null) {
            return
        }
        
        let redis = this.getClient();
        
        var ret = await redis.get(id)
        
        if (ret == null) return null
        return ret;
    }
    async getset(id, val) {
        let redis = this.getClient();
        if (id == null) {
          return
        }
      
        var ret = await redis.getset(id, val)
        if (ret == null) return null
        return JSON.parse(ret)
    }
    
    async lpush(id, val) {
        let redis = this.getClient();
        if (id == null || val == null) {
          return
        }
    
        var ret = await redis.lpush(id, JSON.stringify(val))
        return ret == 'ok'
    }
    
    async rpush(id, val) {
        if (id == null || val == null) {
          return
        }
        let redis = this.getClient();
        var ret = await redis.rpush(id, JSON.stringify(val))
        return ret == 'ok'
    }
    
    async lpop(id) {
        let redis = this.getClient();
        if (id == null) {
          return
        }
        return await redis.lpop(id)
    }

    /**
     * 阻塞pop
     * @param id 
     */
    async blpop(id,timeout?:number){
        if(timeout == null)
            timeout = 15
        let redis = this.getClient();
        if (id == null) {
          return
        }
        return await redis.blpop(id,timeout);
    }

    /**
     * 阻塞pop
     * @param id 
     */
    async brpop(id,timeout?:number){ 
        if(timeout == null)
            timeout = 15
        let redis = this.getClient();
        if (id == null) {
          return
        }
        return await redis.brpop(id,timeout);
    }
}
