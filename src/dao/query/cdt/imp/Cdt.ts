/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
import OperatorFac from './../../../../formula/operator/OperatorFac';
import ColChanger from '../../../colChanger/ColChanger';
import { Sql, ColSql, ValSql } from '../../../sql'
import BaseCdt from '../BaseCdt'


export default class Cdt extends BaseCdt {
  
  private op: string;
  private col: string;
  private val: any;
  constructor(col: string, value, op?: string) {
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
    return OperatorFac.get(this.op).toEs(this.col, this.val)
  }
  getCol():string{
    return this.col;
  }

  getOp():string{
    return this.op;
  }

  getVal() {
    return this.val
  }

  toSql(colChanger?:ColChanger): Sql {
    if(this.val instanceof Array && this.val.length == 0){
      return new Sql('1=2');
    }
    const _sql: Sql = new Sql()
    let col = this.col;
    _sql.add(new ColSql(this.changeCol(col,colChanger)))
    _sql.add(this.op)

    _sql.add(new ValSql(this.val))
    return _sql
  }
  isHit(obj) {
    var val = obj[this.col]
    var opt = OperatorFac.get(this.op)
    if (opt == null) return false
    return opt.cal([val, this.val])
  }
}