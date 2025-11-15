import Context from './../context/Context';
export default abstract class Searcher<Pojo = any> {
    protected _map: {};
    protected _context: Context;
    /**
     * 传入的id中是否有0
     * @returns
     */
    protected hasZeroId(): boolean;
    /**
     * 出事化，注册inquiry
     * @param context
     */
    protected abstract init(context: Context): any;
    /**
     * 返回表格名
     */
    protected abstract getKey(): string;
    setContext(context: Context): void;
    getContext(): Context;
    protected getIdKey(): string;
    protected getDao(): Dao;
    protected getNoKey(): string;
    /**
     * 是否逻辑删除
     */
    protected getIsDel(): boolean;
    afterBuild(context: Context): void;
    /**
     * 注册key
     * @param inquiryKey
     * @param inquiry
     */
    reg(inquiryKey: string, inquiry: BaseInquiry): void;
    protected getSchCols(): Array<string>;
    _getAll(): Array<BaseInquiry>;
    save(key: string, array: Array<any>): Promise<void>;
    /**
     * 根据id保存到缓存中，以后get 和findByIds可以从缓存中读取数据
     * @param key
     * @param array
     */
    saveByIds(array: any[]): Promise<void>;
    get(key: any): BaseInquiry;
    getCache(key: any): BaseCache;
    saveAll(array: Array<any>): Promise<void>;
    /**
     * 清空缓存，对于多表查询可能无效
     */
    clearCache(): void;
    /**
     * 根据ids 列表查询多条记录
     * @param array
     */
    findByIds(idArray: Array<any>, col?: string): Promise<Pojo[]>;
    findAndCheck(idArray: any[], schQuery?: any, cols?: string[]): Promise<Pojo[]>;
    /**
     *
     * @param obj 带有主键的对象
     * @param cols  需要检查的字段
     * @returns
     */
    getByObj(obj: any, cols?: string[]): Promise<Pojo>;
    /**
     * 从缓存中拿
     * @param array
     * @param col
     */
    findByIdsFromCache(array: any, col?: string): any[];
    buildWithZeroId(): Pojo;
    getById(id: any, cols?: string[]): Promise<Pojo>;
    /**
     * 从缓存中拿
     * @param array
     * @param col
     */
    getFromCache(id: any): any;
}
import BaseInquiry from './inquiry/BaseInquiry';
import BaseCache from './inquiry/cache/BaseCache';
import Dao from './../dao/Dao';
