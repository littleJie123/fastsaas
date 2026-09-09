import ArrayCdt from '../ArrayCdt';
import Sql from '../../../sql/Sql';
import IColChanger from '../../../colChanger/IColChanger';
export default class AndCdt extends ArrayCdt {
    toSql(colChanger: IColChanger): Sql;
    toEs(): {};
    isHit(obj: any): boolean;
}
