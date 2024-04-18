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

    protected async getData(): Promise<any> {
        let data = await super.getData();
        let joints = this.getJoints();
        if(joints != null){
            for(let joint of joints){
                await this.processJoint(joint,data)
            }
        }
        return data;
    }
     
    async processJoint(joint:{
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
    },data){
        if(joint != null && data != null){
            let dao:Dao = this._context.get(`${joint.table}Dao`);
            if(dao){
                let pkCol = joint.pkCol;
                if(pkCol == null)
                    pkCol = `${joint.table}_id`;
                let row = await dao.getById(data[pkCol]);
                if(row != null){
                    data[joint.col] = row[joint.col];
                }
            }
        }
    }


    async doExecute(){
         
        
        await this.getDao().add(await this.getData())
    }
    
}

