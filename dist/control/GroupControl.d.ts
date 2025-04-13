import ListControl, { ListParam, ListResult } from './ListControl';
import Query from './../dao/query/Query';
/**
 * 做group by的control
 */
export default abstract class GroupControl<Param extends ListParam = ListParam> extends ListControl<Param> {
    /**
     * 内存查询的列
     */
    protected _arrayCdt: Array<string>;
    /**
     * group 字段
     * _orderArray 设置排序
     */
    protected acqGroup(): Array<string>;
    /**
     * 处理当前页数据
     * @param list
     */
    protected _processPageList(list: Array<any>): Promise<Array<any>>;
    /**
     * 是否设置数据库排序
     * @returns
     */
    protected _needOrder(): boolean;
    /**
     * 是否设置数据库排序
     * @returns
     */
    protected _needPager(): boolean;
    /**
     * 内存排序
     * @param list
     */
    protected _pageOrder(list: any): void;
    addOrder(query: Query): Promise<void>;
    protected addCdt(query: Query): Promise<void>;
    buildQuery(): Promise<Query>;
    /**
    * 使用findData 函数
    */
    protected useFindData(): boolean;
    protected find(query: Query): Promise<any[]>;
    /**
     * 内存过滤
     * @param list
     */
    protected _filterByArrayCdt(list: any): Promise<any>;
    protected doExecute(): Promise<any>;
    /**
     * 搜索数量和值
     * @param map
     * @param query
     */
    protected schCnt(map: any, query: any): Promise<void>;
    /**
     * 内存中分页
     * @param map
     */
    slice(map: ListResult): void;
    /**
     * setPage 注销掉，因为group 必须查询所有数据才知道数量
     * @param query
     */
    protected _setPage(query: Query): void;
}
