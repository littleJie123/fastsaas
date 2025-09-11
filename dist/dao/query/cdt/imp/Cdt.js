"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 查询条件，
 * 支持sql 、monggo、es
 */
const OperatorFac_1 = __importDefault(require("./../../../../formula/operator/OperatorFac"));
const sql_1 = require("../../../sql");
const BaseCdt_1 = __importDefault(require("../BaseCdt"));
const fastsaas_1 = require("../../../../fastsaas");
/**
 * 支持多个字段的in查询
 */
class Cdt extends BaseCdt_1.default {
    constructor(col, value, op) {
        super();
        if (op == null) {
            if (value instanceof Array) {
                op = 'in';
            }
            else {
                op = '=';
            }
        }
        this.col = col;
        this.val = value;
        this.op = op;
    }
    toEs() {
        return OperatorFac_1.default.get(this.op).toEs(this.col, this.val);
    }
    getCol() {
        return this.col;
    }
    getOp() {
        return this.op;
    }
    getVal() {
        return this.val;
    }
    toSql(colChanger) {
        if (this.val instanceof Array && this.val.length == 0) {
            return new sql_1.Sql('1=2');
        }
        const _sql = new sql_1.Sql();
        let col = this.col;
        if (!(col instanceof Array)) {
            if (colChanger == null) {
                _sql.add(col);
            }
            else {
                _sql.add(colChanger.changeSql(col));
            }
        }
        else {
            let colArray = this.col;
            let array = colArray.map((col) => {
                if (colChanger == null) {
                    return col;
                }
                else {
                    return colChanger.changeSql(col);
                }
            });
            let colSql = `(${array.join(',')})`;
            _sql.add(colSql);
        }
        _sql.add(this.op);
        _sql.add(new sql_1.ValSql(this.val));
        return _sql;
    }
    isHit(obj) {
        if (!(this.col instanceof Array)) {
            //var val = obj[this.col]
            let val = fastsaas_1.JsonUtil.getByKeys(obj, this.col);
            let opt = OperatorFac_1.default.get(this.op);
            if (opt == null)
                return false;
            return opt.cal([val, this.val]);
        }
        else {
            //多个字段
            for (let col of this.col) {
                let val = fastsaas_1.JsonUtil.getByKeys(obj, col);
                let opt = OperatorFac_1.default.get(this.op);
                if (opt == null)
                    return false;
                let ret = opt.cal([val, this.val]);
                if (!ret) {
                    return false;
                }
            }
            return true;
        }
    }
}
exports.default = Cdt;
