
/**
 * 用来导出数据
 */
export default class ExportData{
    async export(param:ExportDataParam):Promise<ExportDataResult>{
        let result = await this._exportMain(param);
        if(param.other){
            for(let table of param.other){
                await this._exportOther(param,table,result)
            }
        }
        return result;
    }

    private async _exportMain(param:ExportDataParam):Promise<ExportDataResult>{
        let dao = param.dao;
        let list = await dao.find(param.query);
        return {
            result:[
                {tableName:param.tableName,datas:list}
            ]
        }
    }

    private async _exportOther(param:ExportDataParam,
         table : OtherTable,
         result:ExportDataResult){
        let tableName = table.tableName;
        let dao = table.dao;
        let depency = table.depency;
        if(depency == null){
            depency = [
                {tableName:param.tableName}
            ]
        }
        let query = new Query();
        for(let dc of depency){
            let datas = this._acqDatasByTableName(dc.tableName,result);
            if(datas != null){
                let idcol = table.col;
                if(idcol == null)
                    idcol = this._acqDefIdCol(dc.tableName);
                let ids = this._acqIdsFromDatas(datas,dc);
                query.in(idcol,ids)

            }
        }
        if(table.otherCdt){
            query.addCdt(BaseCdt.parse(table.otherCdt));
        }
        let schRet = await dao.find(query);
        result.result.push({
            tableName:table.tableName,
            datas:schRet
        })
    }


    private _acqIdsFromDatas(datas,dc:ExportDepency){
        let col = dc.col;
        if(col == null){
            col = this._acqDefIdCol(dc.tableName);
        }
        return ArrayUtil.toArrayDis(datas,col);
    }

    private _acqDatasByTableName(tableName:string,result:ExportDataResult){
        let tableResult = result.result;
        for(let tr of tableResult){
            if(tr.tableName == tableName)
                return tr.datas;
        }
        return null;
    }
    private _acqDefIdCol(tableName){
        return tableName + '_id';
    }
}

import ExportDataParam from "./dto/ExportDataParam";

import ExportDataResult from "./dto/ExportDataResult";
import Query from './../dao/query/Query';
import BaseCdt from './../dao/query/cdt/BaseCdt';
import ExportDepency from "./dto/ExportDepency";
import {ArrayUtil} from './../util/ArrayUtil';
import OtherTable from "./dto/OtherTable";

