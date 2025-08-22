import { Context, IGeter, Searcher } from "../fastsaas";
interface LoadOpt {
    /**
     * 读取id的数据
     */
    idGeter?: IGeter;
    /**
     * 查询的表名
     */
    table: string;
    /**
     * 查询出来的数据只保留这些值
     */
    dataCols?: string[];
    /**
     * 往原始数据赋值
     */
    toOriginalRow?: boolean;
    /**
     * 数据和关联表的处理函数
     * @param row
     * @param data
     * @param originalRow //原始数据
     */
    fun?(loadData: any, nextData: any, originalRow?: any): any;
    /**
     * 不向上一级设置值
     */
    notToPre?: boolean;
}
interface Opt {
    context: Context;
}
export default class {
    private opt;
    constructor(opt: Opt);
    /**
     * 根据key 从关联表加载数据
     * @param rows
     * @param opts
     */
    load(rows: any[], opts: LoadOpt[]): Promise<void>;
    private doLoad;
    private processData;
    private loadCache;
    getSearcher(opt: LoadOpt): Searcher;
    private getDataIds;
    private getIdGeter;
}
export {};
