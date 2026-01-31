import ColChanger from "../../../colChanger/ColChanger";
import { Sql } from "../../../sql";
import BaseCdt from "../BaseCdt";
interface CaseCdtOpt {
    col: string;
    op?: string;
    tableName: string;
    datas: any[];
}
export default class CaseCdt extends BaseCdt {
    private opt;
    constructor(opt: CaseCdtOpt);
    getPkCol(): string;
    private changeSql;
    toSql(colChanger: ColChanger): Sql;
    isHit(row: any): boolean;
    toEs(): void;
}
export {};
