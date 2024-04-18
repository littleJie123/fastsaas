import IChanger from "./IChanger";
import JSONChanger from "./JSONChanger";

export default class ArrayJSONChanger{

    private array:IChanger[] = [];
    constructor(array:IChanger[]){
        this.array = array
    }

    change(obj){
        let list = this.getArrayChanger();
        return this._build(list,obj)
    }

    private _build(list:JSONChanger[],obj){
        if(obj == null)
            return null
        let array = this.array;
        if(array == null || array.length == 0)
            return obj;
        let retObj = {};
        
        for(let changer of list){
            changer.changeTo(obj,retObj);
        }
        return retObj;
    }

    private getArrayChanger():JSONChanger[]{
        return this.array.map(function(row){
            return new JSONChanger(row)
        })
    }

    private getReverseChanger(){
        let list = this.getArrayChanger();
        return list.map(row=>row.reverse())
    }

    reverse(obj){

        return this._build(this.getReverseChanger(),obj)
    }
}