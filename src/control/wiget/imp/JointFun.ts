import {ArrayUtil} from './../../../util/ArrayUtil';
import JointWiget from "../JointWiget";
/**
 * 执行函数的联合表
 */
export default class extends JointWiget{
    protected params:{key:string,value:any}[] = [];
    protected async find(): Promise<any[]> {
        if(this.params.length == 0)
            return null;
        let param = {};
        for(let p of this.params){
            param[p.key] = p.value
        }
        let list = await this.opt.fun(param); 
        let tableCol = this.opt.tableCol;
        if(tableCol != null){
            list = ArrayUtil.toArrayDis(list,tableCol);
        } 
        return list;
    }
    async addParam(key: string, value: any, cdtFun: Function): Promise<void> {
        this.params.push({key,value})
    }
    
}