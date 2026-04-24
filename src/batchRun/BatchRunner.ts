import { AndCdt, Context, Dao, NotCdt, Query, StrUtil } from "../fastsaas";

interface ProcessResult {
  stop?: boolean
}
interface Opt<Pojo = any> {
  context?: Context;
  pageSize?: number;
  tableName?: string;
  /**
   * 排序字段，默认主键
   */
  sortCol?: string
  /**
   * 查询条件
   */
  query?: any;
  /**
   * 查询的字段
   */
  colArray?: string[]
  /**
   * 处理函数
   * @param list 
   */
  process?(list: Pojo[]): Promise<ProcessResult | void>;
}
/**
 * 
 * 分批查询数据，按披运行。需要指定sortCol
 */
export default class BatchRunner<Pojo = any> {
  private opt: Opt<Pojo>;

  constructor(opt: Opt<Pojo>) {
    this.opt = {
      ... this.getInit(),
      ...opt
    }
  }
  protected getInit(): Opt<Pojo> {
    return {
      pageSize: 1000,
      query: {}
    }
  }
  private isOver(list: any[]) {
    if (list == null) {
      return false;
    }
    return list.length < this.opt.pageSize;
  }
  async process() {
    let list: Pojo[] = null;
    let cnt = 0;
    while (!this.isOver(list)) {
      list = await this.findList(list)
      if (list.length > 0) {
        let result: any = await this.doProcess(list);
        cnt += list.length;

        if (result?.stop) {
          return;
        }

      }
    }

  }

  protected async doProcess(list: Pojo[]) {

    return this.opt.process(list);
  }


  protected async findList(list: any[]): Promise<any[]> {
    let query: Query = this.buildQuery();
    let col = this.getCol();
    if (list != null && list.length > 0) {
      let pkCol = this.getPkCol();
      if (col == pkCol) {
        query.big(col, list[list.length - 1][col])
      } else {
        query.bigEq(col, list[list.length - 1][col])
        let andCdt = new AndCdt()
        andCdt.eq(col, list[list.length - 1][col]);
        andCdt.lessEq(pkCol, list[list.length - 1][pkCol]);
        query.addCdt(new NotCdt(andCdt));
      }
    }
    return this.getDao().find(query);
  }

  protected getDao(): Dao {
    return this.opt.context.get(this.opt.tableName + 'Dao')
  }

  protected buildQuery(): Query {
    let query = Query.parse(this.opt.query);
    if (this.opt.colArray != null) {
      query.col(this.opt.colArray)
    }
    query.size(this.opt.pageSize)
    let col = this.getCol();
    if (col == this.getPkCol()) {
      query.order(col)
    } else {
      query.addOrder(col);
      query.addOrder(this.getPkCol())
    }

    return query;
  }
  protected getCol(): string {
    let col = this.opt.sortCol;
    if (col == null) {
      col = this.getPkCol()
    }
    return col;
  }
  private getPkCol(): string {
    return StrUtil.firstLower(StrUtil.changeUnderStringToCamel(this.opt.tableName) + 'Id')
  }
}
