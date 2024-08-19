"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GroupControl_1 = __importDefault(require("./GroupControl"));
/**
 * 通过searcher的方法查询的
 */
class default_1 extends GroupControl_1.default {
    getDao() {
        return null;
    }
    async buildQuery() {
        return null;
    }
    getSearcher() {
        let tableName = this.getTableName();
        if (tableName == null)
            throw new Error('tablename is null');
        let context = this.getContext();
        return context.get(tableName + 'searcher');
    }
    getTableName() {
        return null;
    }
    async find() {
        let searcher = this.getSearcher();
        let funName = this.getFunName();
        var list = await searcher[funName](await this._parseSearchParam());
        return list;
    }
    async _parseSearchParam() {
        if (this._schKey == null) {
            return this._param;
        }
        return this._param[this._schKey];
    }
}
exports.default = default_1;
