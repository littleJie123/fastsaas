/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
import ColChanger from '../../../colChanger/ColChanger';
import Sql from '../../../sql/Sql'
import BaseCdt from '../BaseCdt'

export default class NotCdt extends BaseCdt {
  

  private _cdt:BaseCdt;
  constructor(cdt:BaseCdt) {
    super();
    this._cdt = cdt;
  }

  
  toEs() {
    return {
      bool:{
        must_not:[this._cdt.toEs()]
      }
    }
  }
  
  toSql(colChanger:ColChanger):Sql {
    var sql = new Sql();
    sql.add('not(')
    sql.add(this._cdt.toSql(colChanger));
    sql.add(')');
    return sql;

  }

  isHit(obj) {
    return !this._cdt.isHit(obj);
    
  }

}