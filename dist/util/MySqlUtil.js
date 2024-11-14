"use strict";
/**
 * 将一些常用的sql放在里面
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
const CaseSql_1 = __importDefault(require("./imp/CaseSql"));
const StrUtil_1 = require("./StrUtil");
class default_1 {
    static dayCdt(colName, strDay) {
        let day = fastsaas_1.DateUtil.parse(strDay);
        let afterDay = fastsaas_1.DateUtil.afterDay(day, 1);
        let andCdt = new fastsaas_1.AndCdt();
        andCdt.bigEq(colName, day);
        andCdt.less(colName, afterDay);
        return andCdt;
    }
    /**
     * 得到某个字段的月份时间
     */
    static monthCdt(colName, month) {
        if (month == null) {
            return null;
        }
        month = month.toString();
        month = this.removeIllegal(month);
        if (isNaN(parseInt(month))) {
            return null;
        }
        if (month.length != 6) {
            return null;
        }
        let year = month.substring(0, 4);
        let m = month.substring(4);
        let begin = `${year}-${m}-01`;
        let end = fastsaas_1.DateUtil.afterMonth(fastsaas_1.DateUtil.parse(begin), 1);
        let andCdt = new fastsaas_1.AndCdt();
        andCdt.bigEq(colName, begin)
            .less(colName, end);
        return andCdt;
    }
    /**
     * 格式化sql
     * @param sql
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static formatSql(sql, obj) {
        return StrUtil_1.StrUtil.formatSql(sql, obj);
    }
    /**
     * 创建数据库的casesql ，如果有来自客户端的值，请做防sql注入的操作
     * @param col
     * @returns
     */
    static buildCaseSql(col) {
        return new CaseSql_1.default(col);
    }
    static buildMonth(colName, asColName) {
        let before = `CONCAT(YEAR(${colName}),LPAD(MONTH(${colName}), 2, '0'))`;
        if (asColName != null) {
            before = `${before} as ${asColName}`;
        }
        return before;
    }
    static removeIllegal(sql) {
        sql = StrUtil_1.StrUtil.replace(sql, "'", '');
        sql = StrUtil_1.StrUtil.replace(sql, "#", '');
        sql = StrUtil_1.StrUtil.replace(sql, "/*", '');
        return sql;
    }
}
exports.default = default_1;
