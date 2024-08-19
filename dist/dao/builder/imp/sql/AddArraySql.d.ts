import SqlBuilder from '../SqlBuilder';
import { Sql } from '../../../sql';
/**
 * 执行addArray的sql 构建
 */
export default class AddArraySql extends SqlBuilder {
    build(arr: object[], opts?: object): Sql;
    protected _need(name: string): boolean;
}
