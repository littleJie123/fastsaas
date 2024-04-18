import JsonKey from '../JsonKey'
export default class extends JsonKey{
    private _keys:string[];
    _parse(keys){
        this._keys = keys.split('#');
    }
    _acqKey(){
        return this._keys[0];
    }
    _enter(result){
        return this._next.change(result[this._keys[0]]);
    }
    _change(result){
        var keys = this._keys;
        for(var key of keys){
            if(result[key] != null)
                this._fun(result,key,result[key]);
        }
        return result
    }
}