"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../fastsaas");
/**
 * 与hat的不同是，在主表中产生的数据是对象，不再只是name
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 */
class PojoHat {
    constructor(opt) {
        this.opt = opt;
    }
    async process(list) {
        let context = this.opt.context;
        let searcher = context.get(this.opt.key + 'Searcher');
        let pkCol = this.getPkCol();
        let key = this.opt.key;
        let dbList = await searcher.findByIds(fastsaas_1.ArrayUtil.toArrayDis(list, pkCol));
        let cols = this.getCols();
        fastsaas_1.ArrayUtil.join({
            list,
            list2: dbList,
            key: pkCol,
            fun: (data, data2) => {
                let ret = { [pkCol]: data2[pkCol] };
                for (let col of cols) {
                    ret[col] = data2[col];
                }
                data[key] = ret;
            }
        });
    }
    getCols() {
        var _a;
        return (_a = this.opt.cols) !== null && _a !== void 0 ? _a : ['name'];
    }
    getPkCol() {
        return fastsaas_1.StrUtil.firstLower(this.opt.key + 'Id');
    }
}
exports.default = PojoHat;
