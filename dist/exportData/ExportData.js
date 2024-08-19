"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 用来导出数据
 */
class ExportData {
    async export(param) {
        let result = await this._exportMain(param);
        if (param.other) {
            for (let table of param.other) {
                await this._exportOther(param, table, result);
            }
        }
        return result;
    }
    async _exportMain(param) {
        let dao = param.dao;
        let list = await dao.find(param.query);
        return {
            result: [
                { tableName: param.tableName, datas: list }
            ]
        };
    }
    async _exportOther(param, table, result) {
        let tableName = table.tableName;
        let dao = table.dao;
        let depency = table.depency;
        if (depency == null) {
            depency = [
                { tableName: param.tableName }
            ];
        }
        let query = new Query_1.default();
        for (let dc of depency) {
            let datas = this._acqDatasByTableName(dc.tableName, result);
            if (datas != null) {
                let idcol = table.col;
                if (idcol == null)
                    idcol = this._acqDefIdCol(dc.tableName);
                let ids = this._acqIdsFromDatas(datas, dc);
                query.in(idcol, ids);
            }
        }
        if (table.otherCdt) {
            query.addCdt(BaseCdt_1.default.parse(table.otherCdt));
        }
        let schRet = await dao.find(query);
        result.result.push({
            tableName: table.tableName,
            datas: schRet
        });
    }
    _acqIdsFromDatas(datas, dc) {
        let col = dc.col;
        if (col == null) {
            col = this._acqDefIdCol(dc.tableName);
        }
        return ArrayUtil_1.ArrayUtil.toArrayDis(datas, col);
    }
    _acqDatasByTableName(tableName, result) {
        let tableResult = result.result;
        for (let tr of tableResult) {
            if (tr.tableName == tableName)
                return tr.datas;
        }
        return null;
    }
    _acqDefIdCol(tableName) {
        return tableName + '_id';
    }
}
exports.default = ExportData;
const Query_1 = __importDefault(require("./../dao/query/Query"));
const BaseCdt_1 = __importDefault(require("./../dao/query/cdt/BaseCdt"));
const ArrayUtil_1 = require("./../util/ArrayUtil");
