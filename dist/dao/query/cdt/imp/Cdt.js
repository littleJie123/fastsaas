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
        _sql.add(new sql_1.ColSql(this.changeCol(col, colChanger)));
        _sql.add(this.op);
        _sql.add(new sql_1.ValSql(this.val));
        return _sql;
    }
    isHit(obj) {
        var val = obj[this.col];
        var opt = OperatorFac_1.default.get(this.op);
        if (opt == null)
            return false;
        return opt.cal([val, this.val]);
    }
}
exports.default = Cdt;
