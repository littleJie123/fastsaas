import SqlBuilder from '../SqlBuilder';
import { Sql, ColSql, ValSql, ReturnSql } from '../../../sql';
import AddArraySql from './AddArraySql';
/**
 * 执行importSql的sql 构建
 */
export default class ImportArraySql extends AddArraySql {

 
  /**
   * 是否需要这个字段, 因为导入的时候需要导入主键
   * @param name 
   * @returns 
   */
  protected _need(name: string) {
    let colChanger = this._opt.getColChanger();
    if(!colChanger.isValid(name)){
      
      return false;
    }
    return (name.substring(0, 1) === '_') ? false : true
  }



}