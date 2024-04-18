
export default abstract class BaseCache{
    protected _inquiry:BaseInquiry;
    protected _key:string;


    abstract  save(e:string, list:Array<any>):Promise<any>;
    abstract get(e):Promise<Array<string>>;
    protected abstract  _removeCache(keys):Promise<any>;
    abstract clearCache();

    constructor(){
       
        
    }

    setInquiry(baseInquiry:BaseInquiry){
        this._inquiry = baseInquiry;
    }
    /**
     * 通过查询的参数删除缓存
     * @param params 
     * @returns 
     */
    async  removeCache(params){
        if(params == null)
            return;
        if(!(params instanceof Array))
            params = [params]
        if(params.length == 0) 
            return;
        var keys = this._parseKeyArray(params);
        
        keys = ArrayUtil.distinct(keys);
        await this._removeCache(keys)
    }
    
    _parseKeyArray(params){
        var inquiry = this._inquiry;
        return ArrayUtil.parse(params,(param)=>{
            return inquiry.acqDataCode(param)
        })
    }
    
    setKey(key){
        this._key = key;
    }
    
    async saveArray(opts,dbs){
        var inquiry = this._inquiry 
        var map = ArrayUtil.toMapArray(dbs,data=>inquiry.acqDataCode(data));
        for(var opt of opts){
            var key = inquiry.acqCode(opt);
            var val = map[key];
            if(val == null)
                val = [];
            await this.save(key,val);
        }
    }
    async onlySaveArray(dbs){
        var inquiry = this._inquiry 
        var map = ArrayUtil.toMapArray(dbs,data=>inquiry.acqDataCode(data));
        for(var key in map){
            var val = map[key];
            await this.save(key,val);
        }
    }
    
    
      /**
      返回结果
      {
        ret, //从缓存中查出的结果
        list //从缓存中找不到的key值
      }  
      */
    async find(optArray):Promise<FindResult>{
        
        let ret = [];
        let notArray = []
        for(let opt of optArray){
            let optRet = await this.get(opt);
            if(optRet != null){
                ArrayUtil.addAll(ret,optRet);
            }else{
                notArray.push(opt)
            }
        }
        return {
            ret,
            list:notArray
        }
       
    }
    
    async _find(hasArray){
        var ret = []
        for (var i = 0; i < hasArray.length; i++) {
            var key = hasArray[i]
            ArrayUtil.addAll(ret, await this.get(key))
        }
        return ret;
    }
    _acqKey(){
        
        return this._inquiry.getKey()
    }
  
}

import Context from './../../../context/Context';
import {ArrayUtil} from './../../../util/ArrayUtil';
import BaseInquiry from '../BaseInquiry';

import FindResult from './dto/FindResult';






