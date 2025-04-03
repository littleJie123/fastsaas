

import BaseOpControl from './BaseOpControl';
export default abstract class extends BaseOpControl {

  /**
   * 默认false，也就是逻辑删除
   * @returns 
   */
  protected needDel() {
    return false;
  }

  protected needCheckName() {
    return false;
  }
  protected async doExecute() {

    let pk = await this.getPkData();
    let num:number = 1;
    if (this.needDel()) {
      num = await this.getDao().del(pk, this.getDataCdt())
    } else {
      num = await this.getDao().update({
        ...pk,
        isDel: 1
      }, this.getDataCdt())
    }
    if(num == 0){
      throw new Error('数据不合法');
    }
    await this.onDel(pk);
    return pk;
  }

  protected async onDel(pk:any):Promise<void>{

  }
}

