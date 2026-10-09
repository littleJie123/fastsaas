/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
import OperatorFac from './../../../../formula/operator/OperatorFac';
import IColChanger from '../../../colChanger/IColChanger';
import { Sql, ColSql, ValSql } from '../../../sql'
import BaseCdt from '../BaseCdt'
import JsonUtil from '../../../../util/JsonUtil';

/**
 * 支持多个字段的in查询
 */
export default class Cdt extends BaseCdt {

  private static readonly OP_SET = new Set<string>([
    '=', '!=', '<>', '>', '>=', '<', '<=', 'in', 'not in', 'like'
  ]);
  
  private op: string;
  private col: string | string[];
  private val: any;
  constructor(col: string|string[], value, op?: string) {
    super();
    if (op == null) {
      if (value instanceof Array) {
        op = 'in'
      } else {
        op = '='
      }
    }
    this.col = col
    this.val = value;
    this.op = op
  }

  toEs() {
    return OperatorFac.get(this.op).toEs(this.col as string, this.val)
  }
  getCol():string{
    return this.col as string;
  }

  getOp():string{
    return this.op;
  }

  getVal() {
    return this.val
  }

  toSql(colChanger?:IColChanger): Sql {
    if(this.val instanceof Array && this.val.length == 0){
      return new Sql('1=2');
    }
    let op = this.resolveSqlOp();
    const _sql: Sql = new Sql()
    let col = this.col;
    
    if(!(col instanceof Array)){
      if(colChanger==null){
        _sql.add(Cdt.quoteField(col))
      }else{
        _sql.add(colChanger.changeSql(col))
      }
    }else {
      let colArray = this.col as string[]
      let array = colArray.map((col)=>{
        if(colChanger==null){
          return Cdt.quoteField(col);
        }else{
          return colChanger.changeSql(col)
        }
      })
      let colSql = `(${array.join(',')})`
      _sql.add(colSql)
    }
     
    _sql.add(op)

    _sql.add(new ValSql(this.val))
    return _sql
  }

  /**
   * 与 MySqlUtil.quoteField 相同：包成反引号标识符，并去掉其中的反引号。
   * 直接写在这里，避免 Cdt 引用 fastsaas 总出口造成循环依赖。
   */
  private static quoteField(field: string): string {
    return `\`${field.replace(/`/g, '')}\``;
  }

  /**
   * 校验字段和操作符，返回写入 SQL 的操作符。
   * 子类可覆盖以跳过注入检查。
   */
  protected resolveSqlOp(): string {
    this.assertColSafe(this.col);
    return this.canonicalOp(this.op);
  }

  /**
   * 已是规范操作符时直接返回，避免多余的 trim。
   */
  private canonicalOp(op: string): string {
    if (typeof op == 'string' && Cdt.OP_SET.has(op)) {
      return op;
    }
    if (typeof op != 'string') {
      throw new Error('Cdt操作符不合法');
    }
    let key = op.trim().toLowerCase();
    if (!Cdt.OP_SET.has(key)) {
      throw new Error('Cdt操作符不合法');
    }
    return key;
  }

  
  isHit(obj) {
    if(!(this.col instanceof Array)){
      //var val = obj[this.col]
      let val = JsonUtil.getByKeys(obj,this.col)
      let opt = OperatorFac.get(this.op)
      if (opt == null) return false
      return opt.cal([val, this.val])
    }else{

      //多个字段
      for(let col of this.col){
        let val = JsonUtil.getByKeys(obj,col)
        let opt = OperatorFac.get(this.op)
        if (opt == null) return false
        let ret = opt.cal([val, this.val])
        if(!ret){
          return false
        }
      }
      return true;
    }
  }
}