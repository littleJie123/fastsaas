/**
 * 联合表的查询条件
 */

import BaseCdt from './../dao/query/cdt/BaseCdt';
import Query from './../dao/query/Query';
import ListControl from "./ListControl";
import JointWiget from "./wiget/JointWiget";
import {ArrayUtil} from './../util/ArrayUtil';
import JointOpt from "./opt/JointOpt";
import JointFun from "./wiget/imp/JointFun";
import JointTable from "./wiget/imp/JointTable";





export default abstract class extends ListControl {
    protected jointWigets:JointWiget[]
    abstract getJointOpt():JointOpt[];


    protected async buildQuery(): Promise<Query> {
        let query = await super.buildQuery()
        let map = {};
        let jws = this.getJointWiget();
        
        await ArrayUtil.groupBySync({
            array:jws,
            key:jw=>jw.getCol(),
            async fun(array:JointWiget[],col:string){
                let ret = null;
                for(let jw of array){
                    ret = await jw.addData(ret);
                }
                map[col] = ret;
            }
        })
        for(let e in map){
            if(map[e] != null){
                query.in(e,map[e])
            }
        }
        return query;

    }
    protected async addCdt(query:Query){
        
        var param = this._param;
        for(var e in param){
            let val = param[e];
            let jointWigets = this.getJointWiget();
            let inJoint = false;
            for(let jw of jointWigets){
                if(jw.isIncludeKey(e)){
                    await jw.addParam(e,val,()=>this.buildCdt(e,val))
                    inJoint = true;
                }
            }
            if(!inJoint)
                query.addCdt(await this.buildCdt(e,param[e]));
        }
    }
     
    /**
     * 返回 联合查询的组件
     * @returns 
     */
    protected getJointWiget():JointWiget[]{
        
        if(this.jointWigets == null){
            this.jointWigets = []
            for(let jo of this.getJointOpt()){
                let jw:JointWiget;
                if(jo.table==null){
                    jw = new JointFun()
                }else{
                    jw = new JointTable();
                }
                jw.setContext(this.getContext());
                jw.setOpt(jo);
                this.jointWigets.push(jw);
            }
        }
        return this.jointWigets;
        
    }
    
}