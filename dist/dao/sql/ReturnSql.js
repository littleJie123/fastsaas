"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sql_1 = __importDefault(require("./Sql"));
class ReturnSql extends Sql_1.default {
    /**
     * @description 返回指定列
     * @param cols
     */
    constructor(cols = []) {
        super();
        this.cols = this._colsToArray(cols);
    }
    toSql() {
        if (!this.cols.length)
            return '';
        let sqlUtil = new SqlUtilFactory().get(type);
        return sqlUtil.returnStr(this.cols);
    }
    toVal() {
        return null;
    }
    /**
     * @description
     * @param col
     */
    add(col) {
        return this;
    }
}
exports.default = ReturnSql;
