import Dao from './../dao/Dao';
import Bean from './../context/decorator/Bean';

import Control from './Control';
import RepeatChecker from '../checker/RepeatChecker';
import { Searcher, StrUtil } from '../fastsaas';
/**
 * 基本操作的对象
 */
export default abstract class extends Control {
  /**
   * 在data中不需要的字段
   */
  protected noDataCols:string[] = null;
  @Bean()
  protected dataCdt:{
    get():any
    getOtherCdt():any;
  };
  protected abstract getTableName(): string;


  protected getBaseDataCdt():any{
    return this.dataCdt;
  }
  protected getNameCol(): string {
    return 'name'
  }

  protected getCheckNameMsg(): string {
    return '名称不能重复'
  }
  /**
   * 返回查询负责的dao
   */
  protected getDao(): Dao {
    let tableName = this.getTableName();
    if (tableName == null)
      throw new Error('必须冲载getTableName');
    let context = this.getContext();
    return context.get(tableName + 'dao');
  };

  protected getSearcher():Searcher{
    let tableName = this.getTableName();
    if (tableName == null)
      throw new Error('必须冲载getTableName');
    let context = this.getContext();
    return context.get(tableName + 'Searcher');
  }

  getPkCol() {
    let ret =  this.getTableName() + 'Id'
    ret = StrUtil.changeUnderStringToCamel(ret);
    ret = StrUtil.firstLower(ret);
    return ret;
  }
  protected async getPkData() {
    let pk = this.getPkCol();
    return {
      [pk]: this._param[pk]
    }
  }

  protected needCheckName(): boolean {
    return true;
  }
  /**
   * 创建单一检查的checker 
   * @param col 
   * @param msg 
   * @returns 
   */
  protected buildRepeatChecker(col: string, msg?: string, otherCdt?: any) {
    if (otherCdt == null) {
      otherCdt = this.getOtherCdt();
    }
    if (msg == null)
      msg = `${col}不能重复。`;
    return new RepeatChecker({
      col,
      code: msg,
      otherCdt,
      key: this.getTableName(),
      context: this.getContext()
    })
  }

  getCheckers() {
    let array = []
    if (this.needCheckName()) {
      array.push(new RepeatChecker({
        col: this.getNameCol(),
        code: this.getCheckNameMsg(),
        otherCdt: this.getOtherCdt(),
        key: this.getTableName(),
        context: this.getContext()
      }))
    }
    return array;
  }
  getOtherCdt(): any {
    let dataCdt = this.getBaseDataCdt();
    if(dataCdt == null){
      return {};
    }
    let ret = dataCdt.getOtherCdt();
    return ret;
  }
  protected async getData() {
    if(this.noDataCols == null || this.noDataCols.length == 0){
      return {
        ... this._param
      };
    }else{
      let ret:any  = {... this._param};
      for(let col of this.noDataCols){
        delete ret[col];
      }
      return ret;
    }
  }

  getDataCdt() {
    let dataCdt = this.getBaseDataCdt();
    if(dataCdt != null){
      return dataCdt.get()
    }
    return null;
  }
}