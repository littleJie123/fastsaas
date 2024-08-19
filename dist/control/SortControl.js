"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Control_1 = __importDefault(require("./Control"));
/**
 * 处理单条数据
 */
class DataControl extends Control_1.default {
    async doExecute() {
        let list = await this._findDatas();
        if (list.length != 2) {
            throw this._createError();
        }
        let sort = list[0].sort;
        list[0].sort = list[1].sort;
        list[1].sort = sort;
        await this._update(list);
    }
    async _update(list) {
        let idCol = this._getIdCol();
        let array = list.map((data) => ({
            [idCol]: data[idCol],
            sort: data.sort
        }));
        let dao = this.getDao();
        await dao.updateArray(array);
    }
    _createError() {
        return new Error('对应的数据不存在');
    }
    async _findDatas() {
        var dao = this.getDao();
        var query = {};
        var param = this._param;
        let keys = this._getNeedParamKey();
        for (let key of keys) {
            query[key] = param[key];
        }
        query[this._getIdCol()] = [param.begin_id, param.end_id];
        return await dao.find(query);
    }
    _getIdCol() {
        let dao = this.getDao();
        return dao.getTableName() + "_id";
    }
}
exports.default = DataControl;
