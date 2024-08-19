import ArrayCdt from '../ArrayCdt';
import Sql from '../../../sql/Sql';
import ColChanger from '../../../colChanger/ColChanger';
export default class OrCdt extends ArrayCdt {
    toEs(): {};
    toSql(colChanger: ColChanger): Sql;
    isHit(obj: any): boolean;
}
