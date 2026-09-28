import { Query, Cdt } from "../fastsaas";
/**
 * 该类和ListControl的buildQuery的写法类似（一摸一样）
 */
export default abstract class QueryBuilder {
    /**
     * 增加排序字段
     *  [{
            order:'sort',desc:'desc'
        }]
     */
    protected _orderArray: {
        order: string;
        desc?: 'desc' | 'asc';
    }[];
    protected _schCols: any;
    protected _noSchCols: any;
    /**
     * 查询 计算符 > <
     * {
     *  begin:'>',
     * end:'<'
     * }
     */
    protected _opMap: any;
    /**
     * 查询字段转化map
     * {
     *  begin:'gmt_crete',
     * end:'gmt_create'
     * }
     */
    protected _colMap: any;
    /**
     * 查询值转化的map
     */
    protected _valueMap: {
        [key: string]: (val: any) => any;
    };
    /**
     * 默认查询类型，可以是Array,结构体{store_id：330108}或者BaseCdt的实例
     *
     */
    protected _schCdt: any;
    /**
     * 通过传入的参数，以及自定义的各项参数产生一个query对象，一个QueryBuilder类可以用在不同的ListControl中，相同的输入产生相同的query。
     * @param param
     */
    protected _noCdt: boolean;
    protected buildCdt(e: string, val: any): Cdt;
    protected doBuildCdt(e: string, val: any): Cdt;
    protected buildCdtItems(cdts: any): Cdt;
    protected buildCdtItem(item: any): Cdt;
    protected createArrayCdt(op?: string): any;
    protected formatLikeValue(value: any): any;
    /**
     * 产生一个like查询语句
     * @param field
     * @param val
     */
    protected like(field: any, val: any, onlyLeft?: boolean): Cdt;
    protected getSchVal(e: string, val: any): any;
    protected getCol(name: any): string;
    protected getOp(name: any): any;
    build(param: any): Query;
}
