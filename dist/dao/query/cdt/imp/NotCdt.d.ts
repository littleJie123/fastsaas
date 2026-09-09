/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
import IColChanger from '../../../colChanger/IColChanger';
import Sql from '../../../sql/Sql';
import BaseCdt from '../BaseCdt';
export default class NotCdt extends BaseCdt {
    private _cdt;
    constructor(cdt: BaseCdt);
    toEs(): {
        bool: {
            must_not: any[];
        };
    };
    toSql(colChanger: IColChanger): Sql;
    isHit(obj: any): boolean;
}
