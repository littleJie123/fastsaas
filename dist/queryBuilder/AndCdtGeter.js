"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
/**
 * 取and的cdt
 */
class AndCdtGeter {
    constructor(opt) {
        this.opt = opt;
    }
    setContext(context) {
        if (this.opt != null) {
            this.opt.context = context;
        }
    }
    setParam(param) {
        if (this.opt != null) {
            this.opt.param = param;
        }
    }
    isHit(key) {
        return this.opt.impsMap[key] != null;
    }
    async processQuery(query, param) {
        var _a;
        if (this.opt != null && ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.param) == null) {
            this.opt.param = param;
        }
        let result = await this.buildCdt(param);
        if (!result.hasValue) {
            return query;
        }
        let cdt = result.cdt;
        if (cdt == null) {
            return null;
        }
        query.addCdt(cdt);
        return query;
    }
    async buildCdt(param) {
        let impMap = this.opt.impsMap;
        let list = [];
        let hasValue = false;
        for (let e in impMap) {
            let imp = impMap[e];
            imp.setSchCol(e);
            let value = param[e];
            if (value != null) {
                let result = await imp.build(param[e], this.buildLinkCdtOpt());
                if (result != null) {
                    if (result.array == null || result.array.length == 0) {
                        return {
                            hasValue: true
                        };
                    }
                    list.push(result);
                }
                hasValue = true;
            }
        }
        let andCdt = this.buildAndCdt(list);
        return {
            hasValue,
            cdt: andCdt
        };
    }
    buildAndCdt(list) {
        if (list.length == 0) {
            return null;
        }
        let andCdt = new fastsaas_1.AndCdt();
        let mapArray = fastsaas_1.ArrayUtil.toMapArray(list, 'col');
        for (let e in mapArray) {
            let array = mapArray[e];
            let ids = this.combineIds(array);
            if (ids == null || ids.length == 0) {
                return null;
            }
            else {
                andCdt.in(e, ids);
            }
        }
        return andCdt;
    }
    combineIds(array) {
        let ret = null;
        for (let row of array) {
            if (row) {
                if (row.array == null || row.array.length == 0) {
                    return null;
                }
                if (ret == null) {
                    ret = row.array;
                }
                else {
                    ret = fastsaas_1.ArrayUtil.and(ret, row.array);
                }
            }
            else {
                return null;
            }
        }
        return ret;
    }
    buildLinkCdtOpt() {
        let opt = this.opt;
        return opt;
    }
}
exports.default = AndCdtGeter;
