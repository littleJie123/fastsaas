

let keyMap = {
    $toArray:function(key:string){
        return function(obj){
            return ArrayUtil.toArray(obj,key)
        }
    }
}

function acqFunByKey(key:string){
    let keyArray = key.split('|');
    let funGeter = keyMap[keyArray[0]];
    if(funGeter)
        return funGeter.apply(null,keyArray.slice(1));
}

function init (obj, keys) {
    for (var i = 0; i < keys.length - 1; i++) {
      var key = keys[i]
      if (obj[key] == null) {
        obj[key] = {}
      }
      obj = obj[key]
    }
    return obj
}

function setKey (obj, key, param) {
    if (key instanceof Function) {
        key(obj, param)
    } else {
        obj[key] = param
    }
    return param
}
class JsonUtil{
    static adds(obj, keys:Array<string>, param) {
        if (keys == null) { return }
        if (!(keys instanceof Array)) {
            keys = [keys]
        }
        if (keys.length == 0 ||
                obj == null ||
                param == null) { 
                    return 
        }
        var obj = init(obj, keys)
        var key = keys[keys.length - 1]
        if (key) {
            if (obj[key] == null) {
                obj[key] = []
            }
        }
        if(!(param instanceof Array))
            param = [param];
        for(let data of param)
            obj[key].push(data)
        return obj
    }

    static getByKeys(obj,keyStr:string){
        if (keyStr == null || keyStr =='') {
            return obj
        }
        let keyArray = keyStr.split('.');
        for (var key of keyArray) { 
            
            if (obj == null) {
                return null
            }
            let fun = acqFunByKey(key);
            if(fun!=null){
                obj = fun(obj)
            }else{
 
                obj = obj[key] 
                
            }
        }
        return obj
    }
    
    /**
      把一个值加到数组中
      
     obj 目标
     keys 设置的key列表
     param 设置值
    */
      
    static add(obj, keys:Array<string>, param) {
        if (keys == null) { return }
        if (!(keys instanceof Array)) {
            keys = [keys]
        }
        if (keys.length == 0 ||
                obj == null ||
                param == null) { 
                    return 
        }
        var obj = init(obj, keys)
        var key = keys[keys.length - 1]
        if (key) {
            if (obj[key] == null) {
                obj[key] = []
            }
        }
        obj[key].push(param)
        return obj
    }
    /**
     设置一个值
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static set (obj, keys:Array<string>|string, param) {
        if (keys == null) { return }
        if (!(keys instanceof Array)) {
            keys = [keys]
        }
        if (keys.length == 0 ||
                obj == null ||
                param == null) { return }
        var obj = init(obj, keys)
        var key = keys[keys.length - 1]
        if (key) {
            setKey(obj, key, param)
        }

        return param
    }
    /**
     * 取值
     * @param obj 
     * @param keys 
     */
    static get (obj, keys:string|Array<string>) {
        if (keys == null) {
            return null
        }
        if (!(keys instanceof Array)) {
            keys = [keys]
        }
        for (var key of keys) {
            if (obj == null) {
                return null
            }
            obj = obj[key]
        }
        return obj
    }
    
    static change(changer:IChanger|IChanger[],obj){
        if(!(changer instanceof Array)){
            changer = [changer]
        }
        let jsonChanger = new ArrayJsonChanger(changer);
        return jsonChanger.change(obj)
    }

    static reverse(changer:IChanger|IChanger[],obj){
        if(!(changer instanceof Array)){
            changer = [changer]
        }
        let jsonChanger = new ArrayJsonChanger(changer);
        return jsonChanger.reverse(obj)
    }
}
export default JsonUtil;
import JSONChanger from "./dto/JSONChanger";
import IChanger from "./dto/IChanger";
import ArrayJsonChanger from "./dto/ArrayJSONChanger";
import { ArrayUtil } from "./ArrayUtil";

