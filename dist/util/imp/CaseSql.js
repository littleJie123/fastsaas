"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NumUtil_1 = __importDefault(require("../NumUtil"));
const StrUtil_1 = require("../StrUtil");
function formatSql(val) {
    if (val == null) {
        return '';
    }
    if (StrUtil_1.StrUtil.isStr(val)) {
        val = StrUtil_1.StrUtil.replace(val, "#", '');
        val = StrUtil_1.StrUtil.replace(val, "/*", '');
        return `${val}`;
    }
    if (NumUtil_1.default.isNum(val)) {
        return val;
    }
}
class TheCase {
    constructor(val) {
        this.colIsNull = false;
        this.val = val;
    }
    toCaseSql() {
        if (this.colIsNull) {
            return `${formatSql(this.col)} is null`;
        }
        if (this.caseSql != null) {
            return this.caseSql;
        }
        if (this.colValue != null) {
            return `${formatSql(this.col)} = ${formatSql(this.colValue)}`;
        }
    }
    toSql() {
        return `When ${this.toCaseSql()} Then ${formatSql(this.val)}`;
    }
}
/**
 *
 *
 */
class default_1 {
    isSum() {
        this.sum = true;
    }
    constructor(colName) {
        this.caseArray = [];
        this.colName = colName;
    }
    toSql() {
        let str = `Case ${this.buildWhen()} ${this.buildElseSql()} End`;
        if (this.sum) {
            str = `Sum(${str})`;
        }
        if (this.colName) {
            str = `${str} as ${this.colName}`;
        }
        return str;
    }
    addCaseSql(caseSql, val) {
        let theCase = new TheCase(val);
        theCase.caseSql = caseSql;
        this.caseArray.push(theCase);
    }
    addValSql(colName, colval, val) {
        let theCase = new TheCase(val);
        theCase.col = colName;
        theCase.colValue = colval;
        this.caseArray.push(theCase);
    }
    addNullCol(colName, val) {
        let theCase = new TheCase(val);
        theCase.col = colName;
        theCase.colIsNull = true;
        this.caseArray.push(theCase);
    }
    /**
     * else的值
     * @param elseValue
     */
    elseValue(elseValue) {
        this.val = elseValue;
    }
    buildWhen() {
        let caseSqls = this.caseArray.map(row => row.toSql());
        return caseSqls.join(' ');
    }
    buildElseSql() {
        if (this.val == null) {
            return '';
        }
        return ` Else ${formatSql(this.val)}`;
    }
}
exports.default = default_1;
