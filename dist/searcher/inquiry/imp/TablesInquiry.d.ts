import BaseInquiry from '../BaseInquiry';
/**
 * 多表查询
 * {
 * }
 */
interface Opt {
    /**
     * 其他表的字段，用来取值查询当前表，不指定的话，将取得所有数据作为多值查询
     */
    otherCol?: string;
    /**
     * 其他的表名
     */
    otherTable?: string;
    /**
     * 其他表的查询方法名称
     */
    otherName?: string;
    /**
     * 本表的查询方法名称
     * 默认用findById查询
     */
    name?: string;
}
export default class TablesInquiry extends BaseInquiry {
    constructor(opt?: Opt);
    acqDataCode(data: any): string;
    acqCode(param: any): string;
    /**
     * 第一步查询
    子类重写,从另外一个searcher 里面找
    */
    protected _findFromOtherSearcher(params: any): Promise<Array<any>>;
    protected getOtherTable(): any;
    protected getOtherName(): any;
    protected _getName(): string;
    protected getSearcher<T>(key: string): T;
    protected _findArray(params: Array<any>): Promise<Array<any>>;
    protected _parseOther(datas: any): any;
    /**
     * 做一个完整的查询
     * @param params
     */
    protected _findFromDb(params: Array<any>): Promise<Array<any>>;
    /**
     * 合并两个表查询出来对数据
     * @param list 主表的数据
     * @param otherDatas 中间表的数据
     */
    protected combineData(list: any[], otherDatas: any[]): any[];
    /**
     * 第二步查询
     * @param datas 从别的表查询出来的数据
     * @param opt  原始查询数据
     */
    protected _find(datas: any, opt: any): Promise<any>;
    acqDataFromCache(params: any, col?: string): any[];
    protected _acqFromSearcherCache(datas: any, col?: string): any[];
    protected _couldSave(): boolean;
}
export {};
