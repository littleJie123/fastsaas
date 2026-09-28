"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class OrCdtGeter {
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
    async process(query, val) {
        if (query == null) {
            return null;
        }
        let cdt = await this.build(val);
        if (cdt == null) {
            return null;
        }
        query.addCdt(cdt);
        return query;
    }
    async build(value) {
        let cdt = new fastsaas_1.OrCdt();
        let list = this.opt.list;
        let array = [];
        for (let row of list) {
            let ret = await row.build(value, this.opt);
            if (ret != null) {
                array.push(ret);
            }
        }
        fastsaas_1.ArrayUtil.groupBy({
            list: array,
            key: 'col',
            fun(array, e) {
                let retArray = [];
                for (let result of array) {
                    retArray.push(...result.array);
                }
                if (retArray.length > 0) {
                    cdt.in(e, fastsaas_1.ArrayUtil.distinct(retArray));
                }
            }
        });
        if (cdt.length() == 0) {
            return null;
        }
        return cdt;
    }
}
exports.default = OrCdtGeter;
