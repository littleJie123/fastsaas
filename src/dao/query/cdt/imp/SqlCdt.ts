import { StrUtil } from "../../../../fastsaas";
import ColChanger from "../../../colChanger/ColChanger";
import { Sql } from "../../../sql";
import BaseCdt from "../BaseCdt";

/**
 * 传入一个sql cdt
 */
export default class extends BaseCdt{
  private sql:string;
  private val:any;
  constructor(sql:string|Sql,val?){
    super()
    if(StrUtil.isStr(sql)){
      this.sql = sql as string;
      this.val = val;
    }else{
      let s = sql as Sql;
      this.sql = s.toSql();
      this.val = s.toVal();
    }
  }
  toSql(colChanger:ColChanger): Sql {
    let sql = this.sql;
    if(colChanger != null){
      sql = colChanger.changeSql(sql);
    }
    return new Sql(this.sql,this.val);
  }
  isHit(row: any): boolean {
    return false;
  }
  toEs() {
    throw new Error("Method not implemented.");
  }
  
}