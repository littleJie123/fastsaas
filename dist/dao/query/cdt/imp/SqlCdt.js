"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../../../fastsaas");
const sql_1 = require("../../../sql");
const BaseCdt_1 = __importDefault(require("../BaseCdt"));
/**
 * 传入一个sql cdt
 */
class default_1 extends BaseCdt_1.default {
    constructor(sql, val) {
        super();
        if (fastsaas_1.StrUtil.isStr(sql)) {
            this.sql = sql;
            this.val = val;
        }
        else {
            let s = sql;
            this.sql = s.toSql();
            this.val = s.toVal();
        }
    }
    toSql(colChanger) {
        let sql = this.sql;
        if (colChanger != null) {
            sql = colChanger.changeSql(sql);
        }
        return new sql_1.Sql(this.sql, this.val);
    }
    isHit(row) {
        return false;
    }
    toEs() {
        throw new Error("Method not implemented.");
    }
}
exports.default = default_1;
