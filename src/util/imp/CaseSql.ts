import NumUtil from "../NumUtil";
import { StrUtil } from "../StrUtil";
function formatSql(val:string):string{
  if(val == null){
    return ''
  }
  if(StrUtil.isStr(val)){
 
    val = StrUtil.replace(val,"#",'');
    val = StrUtil.replace(val,"/*",'');
    return `${val}`;
  }
  if(NumUtil.isNum(val)){
    return val;
  }
}

 
class TheCase{
  caseSql:string;
  col:string;
  colIsNull:boolean = false;
  val:string;

  colValue;

  constructor(val:any){
    this.val = val;
  }
  private toCaseSql(){
    if(this.colIsNull){
      return `${formatSql(this.col)} is null`
    }
    if(this.caseSql != null){
      return this.caseSql;
    }
    if(this.colValue != null){
      return `${formatSql(this.col)} = ${formatSql(this.colValue)}`
    }
  }

  toSql(){
    return `When ${this.toCaseSql()} Then ${formatSql(this.val)}`
  }


}
/**
 *  
 * 
 */
export default class {
  private colName:string;
  private caseArray:TheCase[]  = [];
  private val:string;
  private sum?:boolean;


  isSum(){
    this.sum = true;
  }
  constructor(colName){
    this.colName = colName
  }
  toSql(){

    let str = `Case ${this.buildWhen()} ${this.buildElseSql()} End`;
    if(this.sum){
      str = `Sum(${str})`;
    }
    if(this.colName){
      str = `${str} as ${this.colName}`
    }
    return str;

  }

  addCaseSql(caseSql:string,val:string){
    let theCase = new TheCase(val)
    theCase.caseSql = caseSql;
    this.caseArray.push(theCase)
  }
  addValSql(colName:string,colval:any,val:string){
    let theCase = new TheCase(val)
    theCase.col = colName;
    theCase.colValue = colval;
    this.caseArray.push(theCase)
  }

  addNullCol(colName:string, val:string){
    let theCase = new TheCase(val)
    theCase.col = colName;
    theCase.colIsNull = true;
    this.caseArray.push(theCase)
  }
  /**
   * else的值
   * @param elseValue 
   */
  elseValue(elseValue:string){
    this.val = elseValue;
  }
  private buildWhen():string{
    let caseSqls = this.caseArray.map(row=>row.toSql());
    return caseSqls.join(' ')
  }

  buildElseSql(){
    if(this.val == null){
      return '';
    }
    return ` Else ${formatSql(this.val)}`;
  }

  
}