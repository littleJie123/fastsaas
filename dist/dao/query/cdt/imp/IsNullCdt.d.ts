import BaseCdt from '../BaseCdt';
import { Sql } from '../../../sql';
import ColChanger from '../../../colChanger/ColChanger';
export default class IsNullCdt extends BaseCdt {
    private _col;
    constructor(col: any);
    toSql(colChanger: ColChanger): Sql;
    toEs(): {
        missing: {
            field: string;
        };
    };
    isHit(obj: any): boolean;
}
