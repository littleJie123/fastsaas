import { Cdt, Dao } from "../fastsaas";
import BaseLinkOpt from "./BaseLinkOpt";
export interface LinkCdtResult {
    col: string;
    array?: any[];
    value?: any;
}
interface LinkTable {
    table: string;
    /**查询结果的列 */
    col?: string;
    op?: string;
    /**
     * 查询列
     */
    schCol?: string;
    /**
     * 不需要isDel
     */
    noIsDel?: boolean;
    /**
     * 从param读取值
     */
    paramKeys?: string[];
    needDistinct?: boolean;
    /**
     * 不需要从param中读取查询条件
     */
    noParam?: boolean;
}
interface LinkCdtImpOpt {
    tables: LinkTable[];
}
export default class LinkCdtImp {
    private schCol;
    private opt;
    setSchCol(schCol: string): void;
    constructor(opt: LinkCdtImpOpt);
    getResultCol(param: BaseLinkOpt): string;
    build(value: any, param: BaseLinkOpt): Promise<LinkCdtResult>;
    protected find(table: LinkTable, lastResult: LinkCdtResult, param: BaseLinkOpt): Promise<LinkCdtResult>;
    protected buildTableCdt(table: LinkTable, lastResult: LinkCdtResult, param: BaseLinkOpt): Cdt;
    protected getOp(table: LinkTable, schCol: string): string;
    protected getValue(schCol: string, op: string, lastResult: LinkCdtResult): any;
    protected getSchCol(linkTable: LinkTable, param: BaseLinkOpt, lastResult: LinkCdtResult): string;
    protected getCol(linkTable: LinkTable, param: BaseLinkOpt): string;
    protected getPkCol(linkTable: LinkTable, param: BaseLinkOpt): string;
    protected getDao(linkTable: LinkTable, param: BaseLinkOpt): Dao;
}
export {};
