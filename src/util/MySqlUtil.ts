/**
 * 将一些常用的sql放在里面
 */

import { AndCdt, BaseCdt, DateUtil, NumUtil } from "../fastsaas";
import CaseSql from "./imp/CaseSql";
import { StrUtil } from "./StrUtil";

export default class{
  /**
   * 得到某个字段的月份时间
   */
  static monthCdt(colName:string,month:string|number):BaseCdt{
    if(month == null){
      return null;
    }
    month = month.toString()
    month = this.removeIllegal(month)
    if(isNaN(parseInt(month))){ 
      return null;
    }
    if(month.length != 6 ){ 
      return null;
    }
    let year =month.substring(0,4);
    let m = month.substring(4);
    let begin = `${year}-${m}-01`;
    let end = DateUtil.afterMonth(DateUtil.parse(begin),1);
    let andCdt = new AndCdt();
    andCdt.bigEq(colName,begin)
      .less(colName,end);
    return andCdt;
  }
  /**
   * 格式化sql
   * @param sql 
   * @param obj 
   * @returns {sql:string,params:any[]}
   */
  static formatSql(sql:string,obj:any):{
    sql:string,
    params?:any[]
  }{
    return StrUtil.formatSql(sql,obj)
  }
  /**
   * 创建数据库的casesql ，如果有来自客户端的值，请做防sql注入的操作
   * @param col 
   * @returns 
   */
  static buildCaseSql(col:string){
    return new CaseSql(col)
  }

  static buildMonth (colName:string,asColName?:string){
    let before = `CONCAT(YEAR(${colName}),LPAD(MONTH(${colName}), 2, '0'))`;
    if(asColName != null){
      before = `${before} as ${asColName}`;
    }
    return before;
  }

  static removeIllegal(sql:string):string{
    sql = StrUtil.replace(sql,"'",'');
    sql = StrUtil.replace(sql,"#",'');
    sql = StrUtil.replace(sql,"/*",'');
    return sql;
  }
}