import Hat from "./Hat";
/**
 * 与hat的不同是，在主表中产生的数据是对象，不再只是name
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 */
export default class PojoHat extends Hat {
    protected _processData(data: any, hatData: any): void;
}
