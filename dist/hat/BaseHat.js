"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseHat {
    constructor(opt) {
        if (opt == null) {
            opt = {};
        }
        this._opt = opt;
        if (opt.fun) {
            this._fun = opt.fun;
        }
    }
    getContext() {
        return this._opt.context;
    }
    async processOne(row) {
        var array = await this.process([row]);
        return array[0];
    }
}
exports.default = BaseHat;
