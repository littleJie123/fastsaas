"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../../../fastsaas");
const sql_1 = require("../../../sql");
const BaseCdt_1 = __importDefault(require("../BaseCdt"));
class CaseCdt extends BaseCdt_1.default {
    constructor(opt) {
        super();
        this.opt = opt;
    }
    getPkCol() {
        return fastsaas_1.StrUtil.firstLower(this.opt.tableName + 'Id');
    }
    changeSql(colChanger, col) {
        if (colChanger == null) {
            return col;
        }
        return colChanger.changeSql(col);
    }
    toSql(colChanger) {
        var _a;
        let opt = this.opt;
        let sql = new sql_1.Sql();
        let col = this.changeSql(colChanger, opt.col);
        sql.add(`${col} ${(_a = opt.op) !== null && _a !== void 0 ? _a : '='} case  `);
        let pkCol = this.getPkCol();
        let dbPk = this.changeSql(colChanger, pkCol);
        for (let data of opt.datas) {
            sql.add(new sql_1.Sql(`when ${dbPk} = ? then ?`, [data[pkCol], data[opt.col]]));
        }
        sql.add('end');
        return sql;
    }
    isHit(row) {
        throw new Error("Method not implemented.");
    }
    toEs() {
        throw new Error("Method not implemented.");
    }
}
exports.default = CaseCdt;
