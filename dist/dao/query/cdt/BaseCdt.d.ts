import IColChanger from '../../colChanger/IColChanger';
import Sql from '../../sql/Sql';
export default abstract class BaseCdt {
    /** 标识符，或恰好一个点的 表.字段 */
    private static readonly COL_REG;
    clazz: string;
    abstract toSql(colChanger: IColChanger): Sql;
    getSql(colChanger: IColChanger): Sql;
    abstract isHit(row: any): boolean;
    abstract toEs(): any;
    isValid(): boolean;
    getClazz(): string;
    /**
     * 字段只允许标识符，或恰好一个点的表.字段。
     */
    protected assertColSafe(col: string | string[]): void;
    private assertOneCol;
    protected changeCol(col: string, colChanger?: IColChanger): string;
    /**
     * 将一个结构体转成条件
     * @param cdt
     * @returns
     */
    static parse(cdt: any): BaseCdt;
}
