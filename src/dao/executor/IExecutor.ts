import ColChanger from "../colChanger/ColChanger";
import { Sql } from "../sql";

export default interface IExecutor{
    
    /**
     * 执行更新
     * @param sql 
     */
    execute(sql:Sql);
    /**
     * 执行查询
     * @param sql 
     */
    query(sql:Sql );

    executeSql(sql:string|String,values?:any[]);
}