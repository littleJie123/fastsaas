"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reducer {
    constructor(opt) {
        if (opt == null) {
            this.opt = {};
        }
        else {
            this.opt = {
                ...opt
            };
        }
    }
    setFun(fun) {
        this.opt.process = fun;
    }
    setPre(pre) {
        this.opt.pre = pre;
    }
    process(mapper) {
        let sumPojos = this.opt.sumPojos;
        for (let sumPojo of sumPojos) {
            let list = this.getPojosBySumPojo(sumPojo, mapper);
            this.doProcess(sumPojo, this.opt.pre, list);
            this.opt.pre = sumPojo;
        }
    }
    /**
     *
     * @param sumPojo
     */
    getPojosBySumPojo(sumPojo, mapper) {
        if (this.opt.getPojosBySumPojo) {
            return this.opt.getPojosBySumPojo(sumPojo, mapper);
        }
    }
    ;
    /**
     * 真正处理
     * @param pre
     * @param pojos
     */
    doProcess(sumPojo, pre, pojos) {
        var _a;
        if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.process) != null) {
            this.opt.process(sumPojo, pre, pojos);
        }
    }
    ;
}
exports.default = Reducer;
