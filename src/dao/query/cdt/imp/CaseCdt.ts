import { StrUtil } from "../../../../fastsaas";
import ColChanger from "../../../colChanger/ColChanger";
import { Sql } from "../../../sql";
import BaseCdt from "../BaseCdt";

interface CaseCdtOpt {
  col: string;
  op?: string;
  tableName: string;
  datas: any[];
}
export default class CaseCdt extends BaseCdt {

  private opt: CaseCdtOpt;
  constructor(opt: CaseCdtOpt) {
    super()
    this.opt = opt;
  }

  getPkCol() {
    return StrUtil.firstLower(this.opt.tableName + 'Id');
  }

  private changeSql(colChanger: ColChanger, col: string) {
    if (colChanger == null) {
      return col;
    }
    return colChanger.changeSql(col)
  }

  toSql(colChanger: ColChanger): Sql {
    let opt = this.opt;
    let sql = new Sql();
    let col = this.changeSql(colChanger, opt.col)
    sql.add(`${col} ${opt.op ?? '='} case  `)
    let pkCol = this.getPkCol();
    let dbPk = this.changeSql(colChanger, pkCol)
    for (let data of opt.datas) {
      sql.add(new Sql(`when ${dbPk} = ? then ?`, [data[pkCol], data[opt.col]]))
    }
    sql.add('end')
    return sql;
  }
  isHit(row: any): boolean {
    throw new Error("Method not implemented.");
  }
  toEs() {
    throw new Error("Method not implemented.");
  }

}