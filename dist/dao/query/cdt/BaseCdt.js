"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCdt {
    constructor() {
        this.clazz = 'BaseCdt';
    }
    getSql(colChanger) {
        return this.toSql(colChanger);
    }
    isValid() {
        return true;
    }
    getClazz() {
        return 'BaseCdt';
    }
    /**
     * 字段只允许标识符，或恰好一个点的表.字段。
     */
    assertColSafe(col) {
        if (col instanceof Array) {
            for (let i = 0; i < col.length; i++) {
                this.assertOneCol(col[i]);
            }
            return;
        }
        this.assertOneCol(col);
    }
    assertOneCol(col) {
        if (typeof col != 'string' || !BaseCdt.COL_REG.test(col)) {
            throw new Error('Cdt字段不合法');
        }
    }
    changeCol(col, colChanger) {
        if (colChanger != null) {
            col = colChanger.parsePojoField(col);
        }
        return col;
    }
    /**
     * 将一个结构体转成条件
     * @param cdt
     * @returns
     */
    static parse(cdt) {
        if (cdt == null)
            return null;
        if (cdt.clazz == 'BaseCdt') {
            return cdt;
        }
        let andCdt = new AndCdt_1.default();
        for (var e in cdt) {
            if (cdt[e] != null) {
                if (cdt[e].clazz == 'BaseCdt') {
                    andCdt.addCdt(cdt[e]);
                }
                else {
                    andCdt.eq(e, cdt[e]);
                }
            }
        }
        return andCdt;
    }
}
/** 标识符，或恰好一个点的 表.字段 */
BaseCdt.COL_REG = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/;
exports.default = BaseCdt;
const AndCdt_1 = __importDefault(require("./imp/AndCdt"));
