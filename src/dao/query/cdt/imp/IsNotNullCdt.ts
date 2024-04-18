import BaseCdt from '../BaseCdt'
import { Sql, ColSql } from '../../../sql'
import ColChanger from '../../../colChanger/ColChanger';

export default class IsNotNullCdt extends BaseCdt{
  
  private _col:string;
  constructor(col){
    super();
    this._col = col
  }
  toSql(colChanger:ColChanger):Sql {
    let sql = new Sql()
    sql.add(new ColSql(this.changeCol(this._col,colChanger)))
    sql.add('is not null')
    return sql
  }

  toEs() {
    return {
      exists:{
        field:this._col
      }
    }
  }

  isHit(obj) {
    return null != obj[this._col]
    
  }
}