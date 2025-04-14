import Dao from './../dao/Dao';
import BaseOpControl from './BaseOpControl';
export default abstract class extends BaseOpControl {
  async doExecute() {
    return await this.getDao().add(await this.getData())
  }
  
}

