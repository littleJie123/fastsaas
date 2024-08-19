import ColChanger from '../../colChanger/ColChanger';
import Sql from '../../sql/Sql';
export default abstract class BaseCdt {
    clazz: string;
    abstract toSql(colChanger: ColChanger): Sql;
    getSql(colChanger: ColChanger): Sql;
    abstract isHit(row: any): boolean;
    abstract toEs(): any;
    getClazz(): string;
    protected changeCol(col: string, colChanger?: ColChanger): string;
    /**
     * 将一个结构体转成条件
     * @param cdt
     * @returns
     */
    static parse(cdt: any): BaseCdt;
}
