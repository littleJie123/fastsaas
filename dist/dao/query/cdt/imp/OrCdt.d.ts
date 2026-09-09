import ArrayCdt from '../ArrayCdt';
import Sql from '../../../sql/Sql';
import IColChanger from '../../../colChanger/IColChanger';
export default class OrCdt extends ArrayCdt {
    toEs(): {};
    toSql(colChanger: IColChanger): Sql;
    isHit(obj: any): boolean;
}
