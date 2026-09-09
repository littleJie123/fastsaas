import IFind from "./interface/IFind";
import Query from "./query/Query";
export interface IFind4UnitDao extends IFind {
    /**
     *
     * @param query 查询条件
     * @param list 上一次处理的dao的findAll执行结果
     */
    parseQueryByDatas?(query: Query, list: any[]): Query;
    /**
     * 查询所有数量
     * @param query
     */
    findAllDatas?(query: Query): any;
}
interface UniteDaoOpt {
    daos: IFind4UnitDao[];
}
/**
 * 将多个dao的查询结果合并，并支持在合并结果上分页
 */
export default class UniteDao implements IFind {
    private opt;
    constructor(opt: UniteDaoOpt);
    findCnt(query: Query): Promise<number>;
    find(query: Query): Promise<any[]>;
    findData(query: any): Promise<any[]>;
    getPojoIdCol(): string;
    private getDaos;
    private hasPage;
    private findWithoutPage;
    private findByPage;
    /**
     * parseQueryByDatas只影响当前dao，传给下一个dao仍是原来的query
     */
    private parseDaoQuery;
    private buildPageQuery;
    private toNum;
}
export {};
