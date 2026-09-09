import IColChanger from "../../../colChanger/IColChanger";
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
    toSql(colChanger: IColChanger): Sql;
    isHit(row: any): boolean;
    toEs(): void;
}
export {};
