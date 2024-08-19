import ColChanger from "../../../colChanger/ColChanger";
import { Sql } from "../../../sql";
import BaseCdt from "../BaseCdt";
/**
 * 传入一个sql cdt
 */
export default class extends BaseCdt {
    private sql;
    private val;
    constructor(sql: string, val?: any);
    toSql(colChanger: ColChanger): Sql;
    isHit(row: any): boolean;
    toEs(): void;
}
