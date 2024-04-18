import Dao from './../dao/Dao';
import BaseOpControl from './BaseOpControl';
/**
 * 从别的表里面拉取数据
 */
export default abstract class extends BaseOpControl{
    /**
     * 返回联合表的字段和
     * @returns 
     */
    protected getJoints():{
        /**
         * 联合表名
         */
        table:string;
        /**
         * 从联合表拿过来的字段
         */
        col:string;
        /**
         * 联合表的主键
         */
        pkCol?:string;
    }[]{
        return null;
    }

    
     
     


    async doExecute(){
        let data = await this.getData();
        
        await this.getDao().update(data)
        let joints = this.getJoints();
        let myTable = this.getTableName();
        if(joints != null){
            for(let joint of joints){
                let dao:Dao = this._context.get(`${joint.table}Dao`);
                if(dao != null ){
                    let pk = joint.pkCol;
                    if(pk == null && myTable!=null){
                        pk = `${myTable}_id`;
                    }
                    if(pk!= null){
                        let col = joint.col;
                        if(data[col] != null){
                            await dao.updateByCdt({
                                [pk]:data[pk]
                            },{
                                [col]:data[col]
                            })
                        }
                    }
                }
            }
        }

    }

     
    
}

