"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class LinkCdtImp {
    setSchCol(schCol) {
        this.schCol = schCol;
    }
    constructor(opt) {
        this.opt = opt;
    }
    getResultCol(param) {
        return this.getCol(this.opt.tables[0], param);
    }
    async build(value, param) {
        var _a;
        let opt = this.opt;
        let tables = opt.tables;
        let ret = {
            col: (_a = this.schCol) !== null && _a !== void 0 ? _a : 'name',
            value: value
        };
        for (let i = tables.length - 1; i >= 0; i--) {
            let table = tables[i];
            if (ret == null || (ret.array != null && ret.array.length == 0)) {
                return null;
            }
            ret = await this.find(table, ret, param);
        }
        return ret;
    }
    async find(table, lastResult, param) {
        let dao = this.getDao(table, param);
        let query = new fastsaas_1.Query();
        if (!table.noIsDel) {
            query.eq('isDel', 0);
        }
        if (param.param && !table.noParam) {
            let paramKeys = [];
            if (param.paramKeys) {
                paramKeys.push(...param.paramKeys);
            }
            if (table.paramKeys) {
                paramKeys.push(...table.paramKeys);
            }
            for (let paramKey of paramKeys) {
                query.eq(paramKey, param.param[paramKey]);
            }
        }
        query.addCdt(this.buildTableCdt(table, lastResult, param));
        let col = this.getCol(table, param);
        return {
            col,
            array: await dao.findCol(query, col)
        };
    }
    buildTableCdt(table, lastResult, param) {
        let schCol = this.getSchCol(table, param, lastResult);
        let op = this.getOp(table, schCol);
        return new fastsaas_1.Cdt(schCol, this.getValue(schCol, op, lastResult), op);
    }
    getOp(table, schCol) {
        if (table.op) {
            return table.op;
        }
        if (schCol == 'name') {
            return 'like';
        }
        return null;
    }
    getValue(schCol, op, lastResult) {
        var _a, _b;
        if (schCol == 'name' && op == 'like') {
            let value = (_a = lastResult.value) !== null && _a !== void 0 ? _a : '';
            if (value.indexOf('%') == -1) {
                return `%${value}%`;
            }
        }
        return (_b = lastResult.value) !== null && _b !== void 0 ? _b : lastResult.array;
    }
    getSchCol(linkTable, param, lastResult) {
        if (linkTable.schCol != null) {
            return linkTable.schCol;
        }
        if (lastResult.col) {
            return lastResult.col;
        }
        let dao = this.getDao(linkTable, param);
        return dao.getPojoIdCol();
    }
    getCol(linkTable, param) {
        if (linkTable.col) {
            return linkTable.col;
        }
        return this.getPkCol(linkTable, param);
    }
    getPkCol(linkTable, param) {
        let dao = this.getDao(linkTable, param);
        return dao.getPojoIdCol();
    }
    getDao(linkTable, param) {
        return param.context.get(linkTable.table + "Dao");
    }
}
exports.default = LinkCdtImp;
