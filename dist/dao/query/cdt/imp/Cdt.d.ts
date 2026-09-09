import IColChanger from '../../../colChanger/IColChanger';
import { Sql } from '../../../sql';
import BaseCdt from '../BaseCdt';
/**
 * 支持多个字段的in查询
 */
export default class Cdt extends BaseCdt {
    private op;
    private col;
    private val;
    constructor(col: string | string[], value: any, op?: string);
    toEs(): void;
    getCol(): string;
    getOp(): string;
    getVal(): any;
    toSql(colChanger?: IColChanger): Sql;
    isHit(obj: any): any;
}
