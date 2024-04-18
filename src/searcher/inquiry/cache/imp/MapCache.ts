import {ArrayUtil} from './../../../../util/ArrayUtil';
import BaseCache from '../BaseCache'
import FindResult from '../dto/FindResult';

export default class MapCache extends BaseCache{
    private _map = {};
    async find(optArray):Promise<FindResult>{
        if(optArray.length>1)
            optArray = ArrayUtil.distinct(optArray);
        let ret:any[] = [];
        let notArray = []
        let map = this._map;
        for(let opt of optArray){
            let optRet =  map[opt];
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
    async clearCache(){
        this._map = {};
    }
    _getMap(){
        return this._map;
    }

    //兼容性考虑
    acqKeys(){
        
        var map = this._getMap();
        var array = [];
        for(var e in map){
            array.push(e)
        }
        return array;
    }
    async save(e, list){
        var map = this._getMap();
        map[e] = list
    }
    get(e){
        var map = this._getMap();
        return map[e];
    }
    async _removeCache(array){
        var map = this._getMap();
        for(var row of array){
            delete map[row];
        }
    }
    
    saveArray(opts,dbs):any{
        
        var inquiry = this._inquiry 
        //var map = ArrayUtil.toMapArray(dbs,data=>inquiry.acqDataCode(data));
        let map = this._map;
        
        
        for(var opt of opts){
            var key = inquiry.acqCode(opt);
            map[key ] = []
            
        }
        
        for(let row of dbs){
            let rowKey = inquiry.acqDataCode(row);

            let array = map[rowKey];
            if(array == null){

                array = []
                
                map[rowKey] = array; 
                
            }
            array.push(row);
        }
        
    }
    


}