import { CsvCol } from './../util/CsvUtil';
import Cdt from './../dao/query/cdt/imp/Cdt';
import Query from './../dao/query/Query';
import BaseCdt from './../dao/query/cdt/BaseCdt';
import Dao from './../dao/Dao';
import Control from "./Control";
export interface ListParam {
    _first?: number;
    pageSize?: number;
    pageNo?: number;
    orderBy?: string;
    desc?: 'desc' | 'asc';
    __download?: boolean;
    [key: string]: any;
}
export interface ListResult {
    content?: any[];
    totalElements?: number;
    first?: number;
    pageSize?: number;
    [key: string]: any;
}
/**
 * 参数__download不为空，则转为下载
 * 查询（不包括group by）的控制类
 */
export default abstract class ListControl<Param extends ListParam = ListParam> extends Control<Param> {
    /**
     * 开关，不需要查询条件
     */
    protected _noCdt: boolean;
    /**
     * 开关，不需要查询数量
     */
    protected _needCnt: boolean;
    /**
     * 增加排序字段
     *  [{
            col:'sort',desc:'desc'
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
    protected getTableName(): string;
    /**
     * 返回查询负责的dao
     */
    protected getDao(): Dao;
    /**
     * 对查询结果的后处理
     * @param list
     */
    protected _processList(list: any[]): Promise<any[]>;
    /**
     返回查询字段
    */
    protected acqCol(): Array<string>;
    /**
     * 是否需要搜索数量
     * @returns
     */
    protected needSchCnt(): boolean;
    /**
     * 是否需要排序
     */
    protected _needOrder(): boolean;
    /**
     根据params的列和值构建某个条件
    */
    protected buildCdt(e: string, val: any): Promise<BaseCdt>;
    protected doBuildCdt(e: string, val: any): BaseCdt;
    protected getSchVal(e: string, val: any): any;
    /**
     * 产生一个like查询语句
     * @param field
     * @param val
     */
    protected like(field: any, val: any, onlyLeft?: boolean): Cdt;
    /**
     * 返回分页大小
     */
    protected getPageSize(): number;
    /**
     * 设置分页
     * @param query
     */
    protected _setPage(query: Query): void;
    protected getFirst(): number;
    /**
    构建查询
    */
    protected buildQuery(): Promise<Query>;
    /**
     * 增加查询条件
     * @param query
     */
    protected addCdt(query: Query): Promise<void>;
    /**
     * 增加排序
     * @param query
     */
    protected addOrder(query: any): Promise<void>;
    /**
     * 返回默认的查询条件
     */
    protected acqDefPageSize(): number;
    /**
     * 处理this._schCdt
     * @param {[type]} query         [description]
     * @yield {[type]} [description]
     */
    protected processSchCdt(query: any): Promise<void>;
    protected getCol(name: any): string;
    /**
     * 使用findData 函数
     */
    protected useFindData(): boolean;
    /**
    返回关联表
    */
    protected getOp(name: any): any;
    protected findByDao(query: Query): Promise<any[]>;
    protected find(query: any): Promise<any[]>;
    protected findCnt(query: Query): Promise<number>;
    protected schCnt(map: ListResult, query: Query): Promise<void>;
    /**
     * 判断当前请求是否下载
     */
    protected isDownload(): boolean;
    protected getDownloadCols(): CsvCol[];
    protected download(): Promise<Buffer>;
    protected buildDownloadInfo(): Promise<any>;
    protected buildDownloadBuffer(list: any[], downloadInfo?: any): Buffer;
    protected doExecute(): Promise<any>;
    protected findData(): Promise<ListResult>;
    protected _sendResp(resp: any, ret: any): void;
    protected getDownloadFileName(): string;
    protected getOnlyCols(): string[];
    protected onlyCols(list: any[]): any[];
}
