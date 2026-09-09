import BaseCdt from '../BaseCdt';
import { Sql } from '../../../sql';
import IColChanger from '../../../colChanger/IColChanger';
export default class IsNullCdt extends BaseCdt {
    private _col;
    constructor(col: any);
    toSql(colChanger: IColChanger): Sql;
    toEs(): {
        missing: {
            field: string;
        };
    };
    isHit(obj: any): boolean;
}
