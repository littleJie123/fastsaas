import IColChanger from '../../colChanger/IColChanger';
import Sql from '../../sql/Sql';
export default abstract class BaseCdt {
    clazz: string;
    abstract toSql(colChanger: IColChanger): Sql;
    getSql(colChanger: IColChanger): Sql;
    abstract isHit(row: any): boolean;
    abstract toEs(): any;
    isValid(): boolean;
    getClazz(): string;
    protected changeCol(col: string, colChanger?: IColChanger): string;
    /**
     * 将一个结构体转成条件
     * @param cdt
     * @returns
     */
    static parse(cdt: any): BaseCdt;
}
