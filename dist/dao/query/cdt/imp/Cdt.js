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
const JsonUtil_1 = __importDefault(require("../../../../util/JsonUtil"));
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
        let op = this.resolveSqlOp();
        const _sql = new sql_1.Sql();
        let col = this.col;
        if (!(col instanceof Array)) {
            if (colChanger == null) {
                _sql.add(Cdt.quoteField(col));
            }
            else {
                _sql.add(colChanger.changeSql(col));
            }
        }
        else {
            let colArray = this.col;
            let array = colArray.map((col) => {
                if (colChanger == null) {
                    return Cdt.quoteField(col);
                }
                else {
                    return colChanger.changeSql(col);
                }
            });
            let colSql = `(${array.join(',')})`;
            _sql.add(colSql);
        }
        _sql.add(op);
        _sql.add(new sql_1.ValSql(this.val));
        return _sql;
    }
    /**
     * 与 MySqlUtil.quoteField 相同：包成反引号标识符，并去掉其中的反引号。
     * 直接写在这里，避免 Cdt 引用 fastsaas 总出口造成循环依赖。
     */
    static quoteField(field) {
        return `\`${field.replace(/`/g, '')}\``;
    }
    /**
     * 校验字段和操作符，返回写入 SQL 的操作符。
     * 子类可覆盖以跳过注入检查。
     */
    resolveSqlOp() {
        this.assertColSafe(this.col);
        return this.canonicalOp(this.op);
    }
    /**
     * 已是规范操作符时直接返回，避免多余的 trim。
     */
    canonicalOp(op) {
        if (typeof op == 'string' && Cdt.OP_SET.has(op)) {
            return op;
        }
        if (typeof op != 'string') {
            throw new Error('Cdt操作符不合法');
        }
        let key = op.trim().toLowerCase();
        if (!Cdt.OP_SET.has(key)) {
            throw new Error('Cdt操作符不合法');
        }
        return key;
    }
    isHit(obj) {
        if (!(this.col instanceof Array)) {
            //var val = obj[this.col]
            let val = JsonUtil_1.default.getByKeys(obj, this.col);
            let opt = OperatorFac_1.default.get(this.op);
            if (opt == null)
                return false;
            return opt.cal([val, this.val]);
        }
        else {
            //多个字段
            for (let col of this.col) {
                let val = JsonUtil_1.default.getByKeys(obj, col);
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
Cdt.OP_SET = new Set([
    '=', '!=', '<>', '>', '>=', '<', '<=', 'in', 'not in', 'like'
]);
exports.default = Cdt;
