import Sql from "../../sql/Sql";
import Builder from '../Builder';
export default abstract class SqlBuilder extends Builder {
    abstract build(arr: object[], opts?: object): Sql;
    protected _pushSqlTxt(sql: Sql, str: string | Sql, val?: any): void;
    protected _isValidCol(col: string): boolean;
    protected _need(name: string): Boolean;
    protected _findCols(dataArray: object[]): any[];
    /**
     * 把db的转成pojo的
     * @param field
     * @returns
     */
    protected parseDbField(field: string): string;
    /**
     * 把pojo的转成db的
     * @param field
     * @returns
     */
    protected parsePojoField(field: string): string;
}
