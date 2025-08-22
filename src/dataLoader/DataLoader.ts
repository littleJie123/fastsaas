import { ArrayUtil, Context, IGeter, JsonUtil, Searcher, StrUtil } from "../fastsaas"

interface LoadOpt {

  /**
   * 读取id的数据
   */
  idGeter?: IGeter,

  /**
   * 查询的表名
   */
  table: string,

  /**
   * 查询出来的数据只保留这些值
   */
  dataCols?: string[];
  /**
   * 往原始数据赋值
   */
  toOriginalRow?: boolean;
  /**
   * 数据和关联表的处理函数
   * @param row 
   * @param data 
   * @param originalRow //原始数据
   */
  fun?(loadData: any, nextData: any, originalRow?: any);
  /**
   * 不向上一级设置值
   */
  notToPre?: boolean
}
interface Opt {
  context: Context;
}
export default class {
  private opt: Opt;
  constructor(opt: Opt) {
    this.opt = opt;
  }
  /**
   * 根据key 从关联表加载数据
   * @param rows 
   * @param opts 
   */
  async load(rows: any[], opts: LoadOpt[]) {
    await this.loadCache(rows, opts)
    for (let row of rows) {
      let loadData = row;
      for (let opt of opts) {
        loadData = await this.doLoad(loadData, row, opt)
      }
    }
  }

  private async doLoad(loadData: any, originalRow: any, opt: LoadOpt) {
    if (loadData == null) {
      return null;
    }
    let geter = this.getIdGeter(opt);
    let id = ArrayUtil.get(loadData, geter);
    if (id == null) {
      return null;
    }
    let searcher = this.getSearcher(opt)
    let nextData = await searcher.getById(id);
    return await this.processData(loadData, nextData, originalRow, opt)
     
  }

  private async processData(loadData: any, nextData: any, originalRow: any, opt: LoadOpt) {
    if (opt.dataCols != null) {
      nextData = JsonUtil.onlyKeys(nextData, opt.dataCols);
    }
    if (opt.fun != null) {
      opt.fun(loadData, nextData, originalRow)
    } else {
      if (!opt.notToPre) {
        loadData[opt.table] = nextData
      }
      if(opt.toOriginalRow){
        originalRow[opt.table] = nextData
      }

    }
    return nextData;
  }

  private async loadCache(rows: any[], opts: LoadOpt[]) {
    for (let opt of opts) {
      let ids = this.getDataIds(rows, opt);
      let searcher = this.getSearcher(opt);
      rows = await searcher.findByIds(ids);
    }
  }

  getSearcher(opt: LoadOpt): Searcher {
    return this.opt.context.get(opt.table+'Searcher')
  }

  private getDataIds(rows: any[], opt: LoadOpt) {
    let geter: IGeter = this.getIdGeter(opt)
    return ArrayUtil.toArrayDis(rows, geter)

  }

  private getIdGeter(opt: LoadOpt) {
    return opt.idGeter ?? StrUtil.firstLower(opt.table + 'Id');
  }


}
