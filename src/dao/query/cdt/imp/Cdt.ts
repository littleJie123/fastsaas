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

  toSql(colChanger?:ColChanger): Sql {
    if(this.val instanceof Array && this.val.length == 0){
      return new Sql('1=2');
    }
    const _sql: Sql = new Sql()
    let col = this.col;
    
    if(!(col instanceof Array)){
      if(colChanger==null){
        _sql.add(col)
      }else{
        _sql.add(colChanger.changeSql(col))
      }
    }else {
      let colArray = this.col as string[]
      let array = colArray.map((col)=>{
        if(colChanger==null){
          return col;
        }else{
          return colChanger.changeSql(col)
        }
      })
      let colSql = `(${array.join(',')})`
      _sql.add(colSql)
    }
     
    _sql.add(this.op)

    _sql.add(new ValSql(this.val))
    return _sql
  }

  
  isHit(obj) {
    if(!(this.col instanceof Array)){
      var val = obj[this.col]
      var opt = OperatorFac.get(this.op)
      if (opt == null) return false
      return opt.cal([val, this.val])
    }else{

      //多个字段
      for(let col of this.col){
        var val = obj[col]
        var opt = OperatorFac.get(this.op)
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