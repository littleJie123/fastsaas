import BaseOpControl from "./BaseOpControl";

 
export default abstract class extends BaseOpControl{
    
    
    async doExecute(){
        
         
        await this.getDao().update(await this.getData() ,this.getDataCdt())
    }
}

