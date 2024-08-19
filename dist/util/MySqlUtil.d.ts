/**
 * 将一些常用的sql放在里面
 */
import { BaseCdt } from "../fastsaas";
import CaseSql from "./imp/CaseSql";
export default class {
    /**
     * 得到某个字段的月份时间
     */
    static monthCdt(colName: string, month: string | number): BaseCdt;
    /**
     * 格式化sql
     * @param sql
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static formatSql(sql: string, obj: any): {
        sql: string;
        params?: any[];
    };
    /**
     * 创建数据库的casesql ，如果有来自客户端的值，请做防sql注入的操作
     * @param col
     * @returns
     */
    static buildCaseSql(col: string): CaseSql;
    static buildMonth(colName: string, asColName?: string): string;
    static removeIllegal(sql: string): string;
}
