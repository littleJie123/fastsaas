import Dao from './../dao/Dao';
import Bean from './../context/decorator/Bean';

import Control from './Control';
import RepeatChecker from '../checker/RepeatChecker';
/**
 * 基本操作的对象
 */
export default abstract class extends Control {
  @Bean()
  protected dataCdt:{
    get():any
    getOtherCdt():any;
  };
  protected abstract getTableName(): string;

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

  getPkCol() {
    return this.getTableName() + 'Id'
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
    if(this.dataCdt == null){
      return {};
    }
    let ret = this.dataCdt.getOtherCdt();
    return ret;
  }
  protected async getData() {
    return {
      ... this._param
    };
  }

  getDataCdt() {
    if(this.dataCdt != null){
      return this.dataCdt.get()
    }
    return null;
  }
}