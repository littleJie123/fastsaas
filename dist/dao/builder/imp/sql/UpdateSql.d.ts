import SqlBuilder from '../SqlBuilder';
import { Sql } from '../../../sql';
export default class UpdateSql extends SqlBuilder {
    /**
    拼凑modify的sql
    */
    build(data: any, opts?: any): Sql;
    /**
     * 构建where前面的sql
     * @param sql
     * @param data
     */
    protected _buildFront(sql: Sql, data: any): void;
}
