import ArrayCdt from '../ArrayCdt';
import Sql from '../../../sql/Sql';
import ColChanger from '../../../colChanger/ColChanger';
export default class AndCdt extends ArrayCdt {
    toSql(colChanger: ColChanger): Sql;
    toEs(): {};
    isHit(obj: any): boolean;
}
