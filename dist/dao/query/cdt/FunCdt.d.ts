/**
 * 只有内存查询才有用
 */
import BaseCdt from './BaseCdt';
import { Sql } from '../../sql';
export default class extends BaseCdt {
    private _fun;
    constructor(fun?: Function);
    isHit(row: any): boolean;
    toEs(): void;
    toSql(): Sql;
}
