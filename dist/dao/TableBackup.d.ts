interface TableBackUpOpt {
    tableName: string;
    schCdt?: ISchCdt;
}
export declare class TableBackUp {
    private opt;
    private dataBakup;
    context: Context;
    setDataBakup(dataBakup: DataBakup): void;
    setContext(context: Context): void;
    constructor(opt: TableBackUpOpt);
    getTableName(): string;
    exportJson(): Promise<any>;
    getSchCdt(): any;
}
export {};
