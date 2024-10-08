import SqlBuilder from '../SqlBuilder'
import BaseCdt from '../../../query/cdt/BaseCdt'
import { ColSql, ValSql, Sql } from '../../../sql';


export default class UpdateSql extends SqlBuilder {
  /**
  拼凑del的sql
  */
  build(data: any, opts?: any): Sql {
    var array = new Sql();
    let colChanger = this._opt.getColChanger();
    this._buildFront(array, data);
    var cnt = 0
    var ids = this._opt.acqIds();
    for (var id of ids) {
      let pojoId = id;
      if(colChanger!=null){
        pojoId = colChanger.parseDbField(pojoId)
      }
      if (cnt++ > 0) {
        this._pushSqlTxt(array, 'and')
      }
      this._pushSqlTxt(array, new ColSql(id))
      this._pushSqlTxt(array, '=')
      this._pushSqlTxt(array, new ValSql(data[pojoId]))
    }
    if (opts) {
      this._pushSqlTxt(array, 'and')
      let cdt = BaseCdt.parse(opts);
      this._pushSqlTxt(array, cdt.toSql(colChanger));
    }
    return array
  }
  protected _buildFront(array: Sql, data) {
    var opt = this._opt;
    this._pushSqlTxt(array, 'delete from ')
    this._pushSqlTxt(array, opt.getTableName())
    this._pushSqlTxt(array, 'where')
  }


}