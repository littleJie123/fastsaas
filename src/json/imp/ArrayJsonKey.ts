import JsonKey from '../JsonKey'
export default class extends JsonKey{
    private _key:string;
    protected _parse(keys){
        if(keys.length>1){
            this._key = keys.substring(1);
        }
    }
    protected _acqKey(){
        return this._key;
    }
    protected _hasKey(){
        return this._key != null;
    }
    protected _isArray(result){
        return (result instanceof Array);
    }
    protected _getArray(result){
        if(result==null) return null;
        if(this._key != null){
            result = result[this._key];
        }
        if(result==null)
            return null;
        if(!(result instanceof Array))
            return [result];
        return result;
    }
    _enter(result){
        var list = this._getArray(result);
        if(list==null){
            return null;
        }
        var next = this._next;
        for(var row of list){
            next.change(row);
        }
    
        if(this._hasKey() || this._isArray(result)){
            return list;
        }else{
            return list[0]
        }
    }
    _change(result){
        
        var array = this._getArray(result);
        if(array==null)
            return;
        for(var i=0;i<array.length;i++){
            this._fun(array,i,array[i]);
        }
        if(this._hasKey()  && !this._isArray(result[this._acqKey()])){
            result[this._acqKey()] = array[0];
        }
    
    }
    change(result){
        let list = result;
        if(!this._hasKey() && !this._isArray(result)){
            list = [result]
        }
        list = super.change(list);
    
        if(!this._hasKey() && !this._isArray(result)){
            return list[0]
        }
        return list;
        
    }
}