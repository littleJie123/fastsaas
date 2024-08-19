import { Sql } from "../sql";
export default interface IExecutor {
    /**
     * 执行更新
     * @param sql
     */
    execute(sql: Sql): any;
    /**
     * 执行查询
     * @param sql
     */
    query(sql: Sql): any;
    executeSql(sql: string | String, values?: any[]): any;
}
