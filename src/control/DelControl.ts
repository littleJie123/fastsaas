
 
import BaseOpControl from './BaseOpControl';
export default abstract class extends BaseOpControl{
    

    protected needDel(){
        return false;
    }

    protected needCheckName(){
        return false;
    }
    async doExecute(){

        let pk = await this.getPkData();
        if(this.needDel()){
            await this.getDao().del(pk,this.getDataCdt())
        }else{
            await this.getDao().update({
                ... pk,
                is_del:1
            },this.getDataCdt())
        }
    }
}

