import Sql from "../../sql/Sql";
import Builder from '../Builder';
import _ from 'lodash'

export default abstract class SqlBuilder extends Builder {
  abstract build(arr: object[], opts?: object): Sql;
  protected _pushSqlTxt(sql: Sql, str: string | Sql, val?: any) {
    if (str['clazz']== 'Sql') {
      sql.add(str);
    } else {
      sql.add(new Sql(<string>str, val))
    }
  }

  protected _isValidCol(col: string): boolean {
    let colChanger = this._opt.getColChanger();
    if(!colChanger.isValid(col)){
      return false;
    }
    return col.substring(0, 1) != '_';
  }

  protected _need(name: string): Boolean {
    let colChanger = this._opt.getColChanger();
    if(!colChanger.isValid(name)){
      return false;
    }
    return (name.substring(0, 1) === '_') ? false : true
  }

  protected _findCols(dataArray: object[]): any[] {
    const map = {}
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i]
      for (let e in data) {
        map[e] = true
      }
    }
    // var map = dataArray[0];
    const array = []
    for (let e in map) {
      if (this._need(e)) {
        array.push(e)
      }
    }
    return array
  }
  /**
   * 把db的转成pojo的
   * @param field 
   * @returns 
   */
  protected parseDbField(field:string):string{
    let colChanger = this._opt.getColChanger();
    if(colChanger == null){
      return field;
    }
    return colChanger.parseDbField(field);
  }
  /**
   * 把pojo的转成db的
   * @param field 
   * @returns 
   */
  protected parsePojoField(field:string):string{
    let colChanger = this._opt.getColChanger();
    if(colChanger == null){
      return field;
    }
    return colChanger.parsePojoField(field);
  }

}