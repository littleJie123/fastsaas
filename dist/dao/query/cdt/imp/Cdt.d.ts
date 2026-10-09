import IColChanger from '../../../colChanger/IColChanger';
import { Sql } from '../../../sql';
import BaseCdt from '../BaseCdt';
/**
 * 支持多个字段的in查询
 */
export default class Cdt extends BaseCdt {
    private static readonly OP_SET;
    private op;
    private col;
    private val;
    constructor(col: string | string[], value: any, op?: string);
    toEs(): void;
    getCol(): string;
    getOp(): string;
    getVal(): any;
    toSql(colChanger?: IColChanger): Sql;
    /**
     * 与 MySqlUtil.quoteField 相同：包成反引号标识符，并去掉其中的反引号。
     * 直接写在这里，避免 Cdt 引用 fastsaas 总出口造成循环依赖。
     */
    private static quoteField;
    /**
     * 校验字段和操作符，返回写入 SQL 的操作符。
     * 子类可覆盖以跳过注入检查。
     */
    protected resolveSqlOp(): string;
    /**
     * 已是规范操作符时直接返回，避免多余的 trim。
     */
    private canonicalOp;
    isHit(obj: any): any;
}
