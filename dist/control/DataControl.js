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
    getTableName() {
    }
    getDao() {
        let tableName = this.getTableName();
        if (tableName == null) {
            throw new Error('tableName没有指定');
        }
        return this.getContext().get(tableName + 'dao');
    }
    ;
    async doExecute() {
        let data = await this._findData();
        if (data == null) {
            throw this._createError();
        }
        return await this._processData(data);
    }
    _createError() {
        return new Error('对应的数据不存在');
    }
    async _findData() {
        var dao = this.getDao();
        var query = {};
        var param = this._param;
        let keys = this._getNeedParamKey();
        for (let key of keys) {
            query[key] = param[key];
        }
        return await dao.findOne(query);
    }
}
exports.default = DataControl;
