import BaseCdt from './../../../dao/query/cdt/BaseCdt';
import Dao from './../../../dao/Dao';
import Query from './../../../dao/query/Query';
import JointWiget from "../JointWiget";
import {ArrayUtil} from './../../../util/ArrayUtil';

export default class extends JointWiget {
    
    protected cdts:BaseCdt[] = [];

    protected async find(): Promise<any[]> {
        let query = new Query();
        let opt = this.opt;
        if(this.cdts.length == 0){
            return null;
        }
        let dao:Dao = this.context.get(`${opt.table}Dao`);
        for(let cdt of this.cdts){
            query.addCdt(cdt);
        }
       // let list = await dao.find(query);
        let tableCol = this.opt.tableCol;
        if(tableCol == null)
            tableCol = this.opt.col;
        return dao.findCol(query,tableCol);
    }
    async addParam(key: string, value: any, cdtFun: Function): Promise<void> {
        let cdt = await cdtFun();
        if(cdt != null){
            this.cdts.push(cdt);
        }
    }
    
}