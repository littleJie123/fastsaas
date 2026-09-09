import BaseCdt from '../BaseCdt'
import { Sql, ColSql } from '../../../sql'
import IColChanger from '../../../colChanger/IColChanger';

export default class IsNullCdt extends BaseCdt{
  
  private _col:string;
  constructor(col){
    super();
    this._col = col
  }
  toSql(colChanger:IColChanger):Sql {
    let sql = new Sql()
    sql.add(new ColSql(this.changeCol(this._col,colChanger)))
    sql.add('is null')
    return sql
  }
  

  toEs() {
    return {
      missing:{
        field:this._col
      }
    }
  }

  isHit(obj) {
    return null == obj[this._col]
    
  }
  

}