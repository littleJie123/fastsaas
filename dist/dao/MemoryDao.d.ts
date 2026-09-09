import { IFind4UnitDao } from "./UniteDao";
import Query from "./query/Query";
/**
 * dao装饰器：先按query查出全部记录，再在内存中按page分页
 */
export default class MemoryDao implements IFind4UnitDao {
    private dao;
    private array;
    constructor(dao: IFind4UnitDao);
    find(query: Query): Promise<any[]>;
    findCnt(query: Query): Promise<number>;
    findData(query: any): Promise<any[]>;
    getPojoIdCol(): string;
    /**
     * 返回上次查询的全量结果，避免再查一次
     */
    findAllDatas(query: Query): any[];
    parseQueryByDatas(query: Query, list: any[]): Query;
    private ensureArray;
    private loadAll;
    private pageInMemory;
    private clearPage;
    private toNum;
}
