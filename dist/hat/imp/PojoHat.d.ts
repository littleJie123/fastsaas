import { Context } from "../../fastsaas";
interface Opt {
    key: string;
    context: Context;
    cols?: string[];
    fun?(data: any, hatData: any): any;
}
/**
 * 与hat的不同是，在主表中产生的数据是对象，不再只是name
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 */
export default class PojoHat {
    private opt;
    constructor(opt: Opt);
    process(list: any[]): Promise<void>;
    protected getCols(): string[];
    protected getPkCol(): string;
}
export {};
