"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCdt_1 = __importDefault(require("../BaseCdt"));
const sql_1 = require("../../../sql");
class IsNullCdt extends BaseCdt_1.default {
    constructor(col) {
        super();
        this._col = col;
    }
    toSql(colChanger) {
        let sql = new sql_1.Sql();
        sql.add(new sql_1.ColSql(this.changeCol(this._col, colChanger)));
        sql.add('is null');
        return sql;
    }
    toEs() {
        return {
            missing: {
                field: this._col
            }
        };
    }
    isHit(obj) {
        return null == obj[this._col];
    }
}
exports.default = IsNullCdt;
