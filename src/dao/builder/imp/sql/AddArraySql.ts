import SqlBuilder from '../SqlBuilder';
import { Sql, ColSql, ValSql } from '../../../sql';
/**
 * 执行addArray的sql 构建
 */
export default class AddArraySql extends SqlBuilder {

  build(arr: object[], opts?: object): Sql {
    const opt = this._opt;
    let sql = new Sql()
    this._pushSqlTxt(sql, 'insert into ')
    this._pushSqlTxt(sql, opt.getTableName());
    this._pushSqlTxt(sql, '(')
    const cols = this._findCols(arr)

    this._pushSqlTxt(sql, new ColSql(opt.parsePojoFieldsToDbFields(cols)))
    this._pushSqlTxt(sql, ')values')
    for (var i = 0; i < arr.length; i++) {
      var data = arr[i]
      if (i > 0) {
        this._pushSqlTxt(sql, ',')
      }
      const val = []
      for (var t = 0; t < cols.length; t++) {
        val.push(data[cols[t]])
      }
      this._pushSqlTxt(sql, new ValSql(val))
    }
    return sql
  }

  protected _need(name: string) {
    const ret = super._need(name)
    if (!ret) return false
    if (!this._opt.isIncrement()) return true

    return !this._opt.isId(name)
  }



}