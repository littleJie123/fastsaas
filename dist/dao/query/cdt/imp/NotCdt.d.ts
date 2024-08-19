/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
import ColChanger from '../../../colChanger/ColChanger';
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
    toSql(colChanger: ColChanger): Sql;
    isHit(obj: any): boolean;
}
