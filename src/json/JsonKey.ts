
function get(opt):JsonKey{
    var keys = opt.keys;
    if(keys.substring(0,1)=='$')
        return new ArrayJsonKey(opt);
    return new ObjJsonKey(opt)
}
export default abstract class JsonKey{
    protected _fun:Function;
    protected _next:JsonKey;
    protected _enter(result){

    }
    protected _change(result){
  
    }
    protected _parse(keys){
  
    }
    protected abstract  _acqKey():string;
    /**
    opt:{
      keys:['aa#bb'],
      fun:function
    }
    */
    constructor(opt){
     
        this._fun = opt.fun;
        var keys = opt.keys;
        this._parse(keys);
    }
    setNext(next:JsonKey){
        if(next != null){
            this._next = next;
        }
    }
    change(result):any{
        if(result==null)
            return;
        if(this._next){
            var next = this._enter(result);
            if(this._acqKey() != null && next!=null){
                result[this._acqKey()] = next
            }
        }else{
            this._change(result);
        }
        return result;
    }

    static get (str,fun):JsonKey{
        if(fun==null){
          fun = (obj,e,val)=>console.log(e,':',val);
        }
        var array = str.split('|');
        var list = [];
        for(var key of array){
            key = StrUtil.trim(key);
            list.push(get({
                fun:fun,
                keys:key
            }));
        }
        for(var i=0;i<list.length-1;i++){
            list[i].setNext(list[i+1]);
        }
        return list[0];
    }
}
import {StrUtil} from '../util/StrUtil'
import ArrayJsonKey from './imp/ArrayJsonKey'
import ObjJsonKey from './imp/ObjJsonKey'
