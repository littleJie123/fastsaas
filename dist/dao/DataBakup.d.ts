import { Context } from "../fastsaas";
import { ISchCdt } from "./DaoHelper";
interface BackUpResult {
    list: any[];
    schCdt: ISchCdt;
    tableName: string;
}
interface TableBackUpOpt {
    tableName: string;
    schCdt?: ISchCdt;
    builder?: SchCdtBuilder;
}
type SchCdtBuilder = (lastResult: BackUpResult) => ISchCdt;
export declare class TableBackUp {
    private opt;
    private dataBakup;
    context: Context;
    setDataBakup(dataBakup: DataBakup): void;
    setContext(context: Context): void;
    constructor(opt: TableBackUpOpt);
    getTableName(): string;
    exportJson(lastResult: BackUpResult): Promise<BackUpResult>;
    getSchCdt(lastResult: BackUpResult): ISchCdt;
}
interface DataBakupOpt {
    schCdt?: ISchCdt;
    context: Context;
    fileName: string;
}
/**
 * 数据备份
 */
export default class DataBakup {
    private opt;
    private tableBackUps;
    constructor(opt: DataBakupOpt);
    getSchCdt(): ISchCdt;
    add(tableName: string, builder?: SchCdtBuilder): void;
    addTableBackUp(tableBackUp: TableBackUp): void;
    backup(): Promise<void>;
    restore(): Promise<void>;
}
export {};
