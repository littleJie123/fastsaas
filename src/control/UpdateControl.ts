import BaseOpControl from "./BaseOpControl";


export default abstract class extends BaseOpControl {


  async doExecute() {

    let data = await this.getData();
    let num = await this.getDao().update(data, this.getDataCdt())
    if(num == 0){
      throw new Error('数据不合法');
    }
    return data;
  }
}

