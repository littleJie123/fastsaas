import { Context } from "../fastsaas";
/**
 * 一个dao的工具类，通过反射机制查询各种数据，主要给单元测试用
 */
interface DaoHelperOpt {
    context: Context;
}
export default class DaoHelper {
    private opt;
    private nameMaps;
    constructor(opt: DaoHelperOpt);
    insertByNames(key: string, names: string[]): Promise<void>;
    findCount(key: string, col: string | null, cdt: any): Promise<any>;
    /**
     * 找到一个
     * @param key
     * @param query
     */
    findOne(key: string, query: any): Promise<any>;
    /**
     * 增加数据
     * @param key
     * @param list
     */
    addArray(key: any, list: any[]): Promise<void>;
    findSum(key: string, col: string, cdt: any): Promise<number>;
    /**
     * 根据条件和表格进行删除
     * @param key
     * @param query
     */
    delByCdt(key: string, query: any): Promise<void>;
    /**
     * 根据name进行查询并且放入缓存
     * @param key
     * @param names
     */
    loadByNames(key: string, names: string[], query?: any): Promise<void>;
    /**
     * 根据id查询
     * @param key
     * @param id
     * @returns
     */
    getById(key: string, id: number): Promise<any>;
    findByIds(key: string, ids: number[]): Promise<any[]>;
    private getSearcher;
    getByName(key: string, name: string, query?: any): Promise<any>;
    private saveToCache;
    private getCacheMap;
    private getFromCache;
    private getByDb;
    find(key: string, query: any): Promise<any[]>;
    private getDao;
}
export {};
