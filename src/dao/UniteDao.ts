import IFind from "./interface/IFind";
import Query from "./query/Query";

export interface IFind4UnitDao extends IFind {
  /**
   * 
   * @param query 查询条件
   * @param list 上一次处理的dao的findAll执行结果
   */
  parseQueryByDatas?(query:Query,list:any[]):Query;

  /**
   * 查询所有数量
   * @param query 
   */
  findAllDatas?(query:Query)
}

interface UniteDaoOpt{
  daos:IFind4UnitDao[]
}

/**
 * 将多个dao的查询结果合并，并支持在合并结果上分页
 */
export default class UniteDao implements IFind{

  private opt:UniteDaoOpt;
  constructor(opt:UniteDaoOpt){
    this.opt = opt;
  }

  async findCnt(query: Query): Promise<number> {
    query = Query.parse(query);
    let cnt = 0;
    let prevDao: IFind4UnitDao = null;
    let prevQuery: Query = query;
    for (let dao of this.getDaos()) {
      let daoQuery = await this.parseDaoQuery(query, dao, prevDao, prevQuery);
      cnt += await dao.findCnt(daoQuery);
      prevDao = dao;
      prevQuery = daoQuery;
    }
    return cnt;
  }

  async find(query: Query): Promise<any[]> {
    query = Query.parse(query).clone();
    if (!this.hasPage(query)) {
      return await this.findWithoutPage(query);
    }
    return await this.findByPage(query);
  }

  async findData(query): Promise<any[]> {
    return this.find(query);
  }

  getPojoIdCol(): string {
    let daos = this.getDaos();
    if (daos == null || daos.length == 0) {
      return null;
    }
    return daos[0].getPojoIdCol();
  }

  private getDaos(): IFind4UnitDao[] {
    if (this.opt == null || this.opt.daos == null) {
      return [];
    }
    return this.opt.daos;
  }

  private hasPage(query: Query): boolean {
    let pager = query.getPager();
    return pager != null && pager.rp != null && pager.rp !== '';
  }

  private async findWithoutPage(query: Query): Promise<any[]> {
    let ret = [];
    let prevDao: IFind4UnitDao = null;
    let prevQuery: Query = query;
    for (let dao of this.getDaos()) {
      let daoQuery = await this.parseDaoQuery(query, dao, prevDao, prevQuery);
      let list = await dao.find(daoQuery);
      if (list != null && list.length > 0) {
        ret.push(...list);
      }
      prevDao = dao;
      prevQuery = daoQuery;
    }
    return ret;
  }

  private async findByPage(query: Query): Promise<any[]> {
    let pager = query.getPager();
    let first = this.toNum(pager.first, 0);
    let rp = this.toNum(pager.rp, 0);
    let ret = [];
    let prevDao: IFind4UnitDao = null;
    let prevQuery: Query = query;
    for (let dao of this.getDaos()) {
      let pageQuery = this.buildPageQuery(query, first, rp);
      let daoQuery = await this.parseDaoQuery(pageQuery, dao, prevDao, prevQuery);
      let list = await dao.find(daoQuery);
      if (list == null) {
        list = [];
      }
      if (list.length >= rp) {
        ret.push(...list.slice(0, rp));
        return ret;
      }
      if (list.length == 0) {
        let cnt = await dao.findCnt(daoQuery);
        first = first - cnt;
      } else {
        ret.push(...list);
        rp = rp - list.length;
        first = 0;
      }
      prevDao = dao;
      prevQuery = daoQuery;
    }
    return ret;
  }

  /**
   * parseQueryByDatas只影响当前dao，传给下一个dao仍是原来的query
   */
  private async parseDaoQuery(query: Query, dao: IFind4UnitDao, prevDao: IFind4UnitDao, prevQuery: Query): Promise<Query> {
    let daoQuery = query.clone();
    if (dao.parseQueryByDatas == null) {
      return daoQuery;
    }
    let list = [];
    if (prevDao != null && prevDao.findAllDatas != null) {
      list = await prevDao.findAllDatas(prevQuery);
      if (list == null) {
        list = [];
      }
    }
    let parsed = dao.parseQueryByDatas(daoQuery, list);
    if (parsed == null) {
      return daoQuery;
    }
    return parsed;
  }

  private buildPageQuery(query: Query, first: number, rp: number): Query {
    let pageQuery = query.clone();
    pageQuery.first(first);
    pageQuery.size(rp);
    return pageQuery;
  }

  private toNum(val, def: number): number {
    if (val == null || val === '') {
      return def;
    }
    let num = parseInt(val as any);
    if (isNaN(num)) {
      return def;
    }
    return num;
  }
}
