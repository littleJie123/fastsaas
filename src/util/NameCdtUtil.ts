import { Context } from "vm";
import Dao from './../dao/Dao';
import Query from "../dao/query/Query";
import { Cdt } from "../dao/query/cdt/imp";
import {ArrayUtil} from './ArrayUtil';


interface Opt{
    context:Context;
    key:string;
    value:string;
    /**
     * 其他查询条件
     */
    otherCdt?:any;
    /**
     * 操作符
     */
    op?:string;
    /**
     * name的字段名称，默认和key一样
     */
    colName?:string;
    /**
     * id的字段名称，默认xxx_id
     */
    idCol?:string;
}
export default class {
    /**
     * 根据名称到一个辅助表里面查询name，返回到主表做in的查询
     * @param context 
     * @param key 必须是 `${tablename}_name`形式
     * @param value 
     */
    static async build(opt:Opt):Promise<Cdt>{
        let key = opt.key;
        let context = opt.context;
        let tableName = key.substring(0,key.length-5);
        let dao:Dao = context.get(tableName+'Dao');
        let idCol = tableName +"_id"
        if(opt.idCol != null)
            idCol = opt.idCol;
        let otherCdt = opt.otherCdt;
        if(otherCdt == null)
            otherCdt = {};
        let query = Query.parse(otherCdt);
        let op = opt.op;
        let colName = opt.colName;
        if(colName == null)
            colName = opt.key;
        if(op == null){
            op = 'like'
        }
        
        if(op == 'like'){
            query.addCdt(new Cdt(colName,`%${opt.value}%`,op))
        }else{
            query.addCdt(new Cdt(colName, opt.value ,op))
        }
        let list = await dao.findCol(query,idCol);
        
        return new Cdt(idCol,list);
    }
}