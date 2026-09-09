import IColChanger from "../../../colChanger/IColChanger";
import { Sql } from "../../../sql";
import BaseCdt from "../BaseCdt";
/**
 * 传入一个sql cdt
 */
export default class extends BaseCdt {
    private sql;
    private val;
    constructor(sql: string | Sql, val?: any);
    toSql(colChanger: IColChanger): Sql;
    isHit(row: any): boolean;
    toEs(): void;
}
