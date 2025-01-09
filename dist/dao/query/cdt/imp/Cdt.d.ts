import ColChanger from '../../../colChanger/ColChanger';
import { Sql } from '../../../sql';
import BaseCdt from '../BaseCdt';
export default class Cdt extends BaseCdt {
    private op;
    private col;
    private val;
    constructor(col: string, value: any, op?: string);
    toEs(): void;
    getCol(): string;
    getOp(): string;
    getVal(): any;
    toSql(colChanger?: ColChanger): Sql;
    private hasBracket;
    isHit(obj: any): any;
}
