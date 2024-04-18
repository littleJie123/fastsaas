import SqlBuilder from '../SqlBuilder'
import BaseCdt from '../../../query/cdt/BaseCdt';
import { ColSql, ValSql, Sql } from '../../../sql';

export default class UpdateSql​​ extends SqlBuilder{
  /**
  拼凑modify的sql
  */
  build (data:any,opts?:any):Sql {
    var array = new Sql();
    this._buildFront(array,data);
    var cnt = 0
    var dbIds = this._opt.acqIds();
    for(var dbId of dbIds) {
      if (cnt++ > 0) {
        this._pushSqlTxt(array, 'and')
      }
      this._pushSqlTxt(array, new ColSql(dbId))
      this._pushSqlTxt(array, '=')
      this._pushSqlTxt(array, new ValSql(data[this.parseDbField(dbId)]))
    }
    if (opts) {
      this._pushSqlTxt(array, 'and')
      let cdt = BaseCdt.parse(opts);
      this._pushSqlTxt(array,cdt.toSql(this._opt.getColChanger()));
    }
    return array
  }
  /**
   * 构建where前面的sql
   * @param sql 
   * @param data 
   */
  protected _buildFront (sql:Sql, data) {
    var opt = this._opt;
    this._pushSqlTxt(sql, 'update ')
    this._pushSqlTxt(sql, opt.getTableName())
    this._pushSqlTxt(sql, ' set')
    var cnt = 0
    let colChanger = this._opt.getColChanger()
    for(var pojoCol in data) {
      if (!opt.isId(pojoCol) && this._isValidCol(pojoCol)) {
        let v = data[pojoCol];
        if (cnt++ > 0) {
          this._pushSqlTxt(sql, ',')
        }
        
        if (v != null && v.getSql) {
          let valueSql:Sql = v.getSql(colChanger);
          this._pushSqlTxt(sql,valueSql);
        } else {
          this._pushSqlTxt(sql, new ColSql(this.parsePojoField(pojoCol)))
          this._pushSqlTxt(sql, '=')
          this._pushSqlTxt(sql, new ValSql(v))
        }
      }
    }
    this._pushSqlTxt(sql, 'where')
    
  }
  
  
}