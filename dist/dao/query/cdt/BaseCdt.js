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
    getClazz() {
        return 'BaseCdt';
    }
    changeCol(col, colChanger) {
        if (colChanger != null) {
            let index = col.lastIndexOf('.');
            if (index == -1) {
                col = colChanger.parsePojoField(col);
            }
            else {
                let start = col.substring(0, index);
                let end = col.substring(index + 1);
                end = colChanger.parsePojoField(end);
                col = `${start}.${end}`;
            }
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
exports.default = BaseCdt;
const AndCdt_1 = __importDefault(require("./imp/AndCdt"));
