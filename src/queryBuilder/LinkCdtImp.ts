import { Cdt, Dao, Query, StrUtil } from "../fastsaas";
import BaseLinkOpt from "./BaseLinkOpt";

export interface LinkCdtResult {
  col: string;
  array?: any[]
  value?: any;

}
interface LinkTable {
  table: string;
  /**查询结果的列 */
  col?: string;

  op?: string;

  /**
   * 查询列
   */
  schCol?: string;

  /**
   * 不需要isDel
   */
  noIsDel?: boolean;
  /**
   * 从param读取值
   */
  paramKeys?: string[]

  needDistinct?:boolean

  /**
   * 不需要从param中读取查询条件
   */
  noParam?:boolean

}

interface LinkCdtImpOpt {
  tables: LinkTable[]
}
export default class LinkCdtImp {



  private schCol:string;

  private opt: LinkCdtImpOpt;

  setSchCol(schCol:string){
    this.schCol = schCol;
  }
  constructor(opt: LinkCdtImpOpt) {
    this.opt = opt;
  }

  getResultCol(param:BaseLinkOpt){
    return this.getCol( this.opt.tables[0],param)
  }

  async build(value: any, param: BaseLinkOpt): Promise<LinkCdtResult> {
    let opt = this.opt;
    let tables = opt.tables;
    let ret: LinkCdtResult = {
      col: this.schCol ?? 'name',
      value: value
    }
    for (let i = tables.length - 1; i >= 0; i--) {
      let table = tables[i];
      if(ret == null || (ret.array !=null && ret.array.length ==0)){
        return null;
      }
      ret = await this.find(table, ret, param)
    }
    return ret
  }
  protected async find(table: LinkTable, lastResult: LinkCdtResult, param: BaseLinkOpt): Promise<LinkCdtResult> {
    let dao = this.getDao(table, param);
    let query = new Query();
    if (!table.noIsDel) {
      query.eq('isDel', 0)
    }
    if (param.param && !table.noParam) {
      let paramKeys: string[] = []
      if (param.paramKeys) {
        paramKeys.push(...param.paramKeys)
      }
      if (table.paramKeys) {
        paramKeys.push(...table.paramKeys)
      }
      for (let paramKey of paramKeys) {
        query.eq(paramKey, param.param[paramKey])
      }
    }
    query.addCdt(this.buildTableCdt(table, lastResult, param))

    let col = this.getCol(table,param);
    
    
    return {
      col,
      array:await dao.findCol(query,col)
    }
  }
  protected buildTableCdt(table: LinkTable, lastResult: LinkCdtResult, param: BaseLinkOpt): Cdt {
    let schCol = this.getSchCol(table, param, lastResult)
    let op = this.getOp(table,schCol);

    return new Cdt(schCol, this.getValue(schCol, op, lastResult), op)
  }
  protected getOp(table: LinkTable,schCol:string):string {
    if(table.op){
      return table.op;
    }
    if(schCol=='name'){
      return 'like'
    }
    return null;
  }



  protected getValue(schCol: string, op: string, lastResult: LinkCdtResult) {
    if (schCol == 'name' && op == 'like') {
      let value = lastResult.value ?? '';
      if (value.indexOf('%') == -1) {
        return `%${value}%`
      }
    }
    return lastResult.value ?? lastResult.array;
  }

  protected getSchCol(linkTable: LinkTable, param: BaseLinkOpt, lastResult: LinkCdtResult): string {
    if (linkTable.schCol != null) {
      return linkTable.schCol;
    }
    if(lastResult.col){
      return lastResult.col
    }
    let dao = this.getDao(linkTable, param)
    return dao.getPojoIdCol()
  }

  protected getCol(linkTable: LinkTable, param: BaseLinkOpt):string{
    if(linkTable.col){
      return linkTable.col
    }
    return this.getPkCol(linkTable,param)
  }

  protected getPkCol(linkTable: LinkTable, param: BaseLinkOpt) {
    let dao = this.getDao(linkTable,param);
    return dao.getPojoIdCol()
  }

  protected getDao(linkTable: LinkTable, param: BaseLinkOpt): Dao {
    return param.context.get(linkTable.table + "Dao");
  }




}