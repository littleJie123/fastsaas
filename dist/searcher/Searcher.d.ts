import Context from './../context/Context';
export default abstract class Searcher<Pojo = any> {
    protected _map: {};
    protected _context: Context;
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
    findByIds(array: Array<any>, col?: string): Promise<Pojo[]>;
    /**
     * 从缓存中拿
     * @param array
     * @param col
     */
    findByIdsFromCache(array: any, col?: string): any[];
    getById(id: any): Promise<Pojo>;
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
