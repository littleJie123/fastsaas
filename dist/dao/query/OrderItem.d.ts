import IColChanger from '../colChanger/IColChanger';
import { Sql } from '../sql';
export default class OrderItem {
    private col;
    private desc;
    constructor(col: string, desc?: string);
    getCol(): string;
    getDesc(): string;
    toSql(colChanger: IColChanger): Sql;
}
