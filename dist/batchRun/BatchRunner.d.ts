import { Context, Dao, Query } from "../fastsaas";
interface ProcessResult {
    stop?: boolean;
}
interface Opt<Pojo = any> {
    context?: Context;
    pageSize?: number;
    tableName?: string;
    col?: string;
    query?: any;
    colArray?: string[];
    process?(list: Pojo[]): Promise<ProcessResult | void>;
}
/**
 * 批量运行
 */
export default class BatchRunner<Pojo = any> {
    private opt;
    constructor(opt: Opt<Pojo>);
    protected getInit(): Opt<Pojo>;
    private isOver;
    process(): Promise<void>;
    protected doProcess(list: Pojo[]): Promise<void | ProcessResult>;
    protected findList(list: any[]): Promise<any[]>;
    protected getDao(): Dao;
    protected buildQuery(): Query;
    protected getCol(): string;
}
export {};
