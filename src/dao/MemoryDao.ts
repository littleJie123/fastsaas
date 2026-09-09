import { IFind4UnitDao } from "./UniteDao";
import Query from "./query/Query";

/**
 * dao装饰器：先按query查出全部记录，再在内存中按page分页
 */
export default class MemoryDao implements IFind4UnitDao {

  private dao: IFind4UnitDao;
  private array: any[];

  constructor(dao: IFind4UnitDao) {
    this.dao = dao;
  }

  async find(query: Query): Promise<any[]> {
    await this.loadAll(query);
    return this.pageInMemory(query);
  }

  async findCnt(query: Query): Promise<number> {
    await this.ensureArray(query);
    return this.array.length;
  }

  async findData(query): Promise<any[]> {
    return this.find(query);
  }

  getPojoIdCol(): string {
    return this.dao.getPojoIdCol();
  }

  /**
   * 返回上次查询的全量结果，避免再查一次
   */
  findAllDatas(query: Query) {
    return this.array;
  }

  parseQueryByDatas(query: Query, list: any[]): Query {
    if (this.dao.parseQueryByDatas == null) {
      return query;
    }
    return this.dao.parseQueryByDatas(query, list);
  }

  private async ensureArray(query: Query) {
    if (this.array == null) {
      await this.loadAll(query);
    }
  }

  private async loadAll(query: Query) {
    if(this.array == null){
      query = Query.parse(query);
      let allQuery = query.clone();
      this.clearPage(allQuery);
      let list = await this.dao.find(allQuery);
      this.array = list == null ? [] : list;
    }
  }

  private pageInMemory(query: Query): any[] {
    let list = this.array;
    if (list == null) {
      return [];
    }
    query = Query.parse(query);
    let pager = query.getPager();
    if (pager == null || pager.rp == null || pager.rp === '') {
      return list.slice();
    }
    let first = this.toNum(pager.first, 0);
    let rp = this.toNum(pager.rp, 0);
    return list.slice(first, first + rp);
  }

  private clearPage(query: Query) {
    let pager = query.getPager();
    if (pager == null) {
      return;
    }
    pager.rp = null;
    pager.first = null;
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
