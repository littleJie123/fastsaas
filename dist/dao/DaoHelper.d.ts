import { Context, IDaoHelper } from "../fastsaas";
import DataCompare from "./DataCompare";
interface ISchCdt {
    cdt?: any;
    sql?: string;
}
interface ExportResult<Pojo = any> {
    list: Pojo[];
    schCdt: ISchCdt;
}
/**
 * 一个dao的工具类，通过反射机制查询各种数据，主要给单元测试用
 */
interface DaoHelperOpt {
    context: Context;
}
export default class DaoHelper implements IDaoHelper {
    private opt;
    private nameMaps;
    constructor(opt: DaoHelperOpt);
    insertByNames(key: string, names: string[]): Promise<void>;
    /**
     * 查找数量，col可以填空
     * @param key
     * @param col
     * @param cdt
     * @returns
     */
    findCount(key: string, col: string | null, cdt: any): Promise<any>;
    /**
     * 找到一个
     * @param key
     * @param paramQuery
     */
    findOne(key: string, paramQuery: any, cols?: string[]): Promise<any>;
    /**
     * 增加数据
     * @param key
     * @param list
     */
    addArray(key: any, list: any[]): Promise<void>;
    /**
     * 更新数组
     * @param key
     * @param list
     */
    updateArray(key: any, list: any[], other?: any, where?: any): Promise<void>;
    update(key: any, obj: any): Promise<void>;
    findSum(key: string, col: string, cdt: any): Promise<number>;
    findSumByCols(key: string, cols: string[], cdt: any): Promise<any>;
    /**
     * 根据条件进行更新
     * @param cdt
     * @param data
     */
    updateByCdt(key: string, whereCdt: any, data: any): Promise<void>;
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
    /**
     * 导出json
     * @param tableName
     * @param schCdt
     * @param fileName
     */
    exportJson<Pojo = any>(tableName: string, schCdt: ISchCdt, fileName: string): Promise<ExportResult<Pojo>>;
    /**
     * 备份文件
     * @param fileName
     */
    private backupFile;
    private buildBackPath;
    protected findBySchCdt(tableName: string, schCdt: ISchCdt): Promise<any[]>;
    /**
     * 导入json
     * @param tableName
     * @param fileName
     */
    importJson(tableName: string, fileName: string): Promise<void>;
    /**
     * 在测试开始前执行
     */
    before<Pojo = any>(tableName: any, cdt: any): Promise<DataCompare<Pojo>>;
}
export {};
