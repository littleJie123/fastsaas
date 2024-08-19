import Context from './../../context/Context';
import Dao from './../../dao/Dao';
import Searcher from './../../searcher/Searcher';
interface PojoHatOpt<Pojo = any> {
    context: Context;
    /**
     * hat table的表名
     */
    key: string;
    /**
     * 自定义处理函数
     * @param data
     * @param hatData
     * @returns
     */
    fun?: (data: Pojo, hatData: any) => any;
    overrideFuns?: {
        [key: string]: Function;
    };
}
/**
 * 基于新结构的hat
 */
export default class<Pojo = any> {
    protected opt: PojoHatOpt<Pojo>;
    constructor(opt: PojoHatOpt<Pojo>);
    protected getContext(): Context;
    protected getSearcher(): Searcher;
    protected getDao(): Dao;
    /**
     * 返回hat table的主键
     * @returns
     */
    protected getColOfHatTable(): string;
    /**
     * 查询 hat 表里面的数据
     * @param list
     * @returns
     */
    protected findDatasFromHatTable(list: Pojo[]): Promise<any[]>;
    /**
     * 构建 帽子数据的map
     * @param list
     * @returns
     */
    protected buildHatMap(list: Pojo[]): Promise<{}>;
    process(list: Pojo[]): Promise<any[]>;
    /**
     * 处理一条记录
     * @param data
     * @param hatData
     * @returns
     */
    protected doProcessHatData(data: any, hatData: any): any;
    /**
     * 处理一条记录,可以重载
     * @param data
     * @param hatData
     * @returns
     */
    protected processData(data: Pojo, hatData: any): any;
    /**
     * 返回拼接到data上name到值，可以重载
     * @returns
     */
    protected getHatNameCol(): string;
    /**
     * 构建数据库中没有查到数据的默认数据
     * @param row
     * @returns
     */
    protected getDefHatData(row: any): any;
}
export {};
