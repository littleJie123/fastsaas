/**
 * 聚合的函数
 * 要求支持es 和 普通的数组
 */
export  default abstract class AggFun{

    protected list:any[] = [];
    hasAgg () {
        return true
    }
    addElement(num){
        
        this.list.push(num);
        
    }

    calList(array:any[]){
        
        return this._fun(array);
    }

    toString(){
        return 'AggFun'
    }

    abstract clone():AggFun;
    protected abstract _fun(array:any[]):number;
}