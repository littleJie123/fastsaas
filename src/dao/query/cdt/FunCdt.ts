/**
 * 只有内存查询才有用
 */
import BaseCdt from './BaseCdt'
import { Sql } from '../../sql';

export default class extends BaseCdt{
    private _fun:Function;
    constructor(fun?:Function){
        super();
        this._fun = fun;
        
    }
    isHit(row):boolean{
        
        return this._fun(row)
    }
    toEs(){
        throw new Error("toEs 不能被执行");
    }

    toSql():Sql{
        throw new Error("toSql 不能被执行");
    }
}