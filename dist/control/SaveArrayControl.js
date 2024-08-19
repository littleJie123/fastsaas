"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../util/ArrayUtil");
const Control_1 = __importDefault(require("./Control"));
class SaveArrayControl extends Control_1.default {
    getDao() {
        return this._context.get(this.getTableName() + 'dao');
    }
    getIdCol() {
        return this.getTableName() + '_id';
    }
    getNoCol() {
        return this.getTableName() + '_no';
    }
    async doExecute() {
        let addArray = this._findAddArray();
        let updateArray = this._findUpdateArray();
        await this._add(addArray);
        await this._update(updateArray);
    }
    _findAddArray() {
        let array = this._param.array;
        let idCol = this.getIdCol();
        return ArrayUtil_1.ArrayUtil.filter(array, (data) => (data[idCol] == null));
    }
    getNoUpdateCols() {
        return [
            'add_user',
            'modify_user',
            'add_time',
            'modify_time',
            'sys_add_time',
            'sys_modify_time',
            this.getNoCol()
        ];
    }
    _findUpdateArray() {
        let array = this._param.array;
        let idCol = this.getIdCol();
        let retArray = ArrayUtil_1.ArrayUtil.filter(array, (data) => (data[idCol] != null));
        let noUpdateCols = this.getNoUpdateCols();
        for (let row of retArray) {
            for (let noUpdateCol of noUpdateCols) {
                delete row[noUpdateCol];
            }
        }
        return retArray;
    }
    async _add(array) {
        let param = this._param;
        if (array != null && array.length > 0) {
            let keys = this._getNeedParamKey();
            let dao = this.getDao();
            for (let obj of array) {
                for (let key of keys) {
                    obj[key] = param[key];
                }
            }
            await dao.addArray(array);
        }
    }
    async _update(array) {
        if (array != null && array.length == 0)
            return;
        let param = this._param;
        let cdt = {};
        let keys = this._getNeedParamKey();
        for (let key of keys) {
            cdt[key] = param[key];
        }
        let dao = this.getDao();
        await dao.updateArray(array, null, cdt);
        let syncData = this.getSyncData();
        if (syncData != null) {
            await syncData.syncData(await dao.findByIds(ArrayUtil_1.ArrayUtil.toArray(array, this.getIdCol())));
        }
    }
    getSyncData() {
        return null;
    }
}
exports.default = SaveArrayControl;
