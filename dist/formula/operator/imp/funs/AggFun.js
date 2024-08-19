"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 聚合的函数
 * 要求支持es 和 普通的数组
 */
class AggFun {
    constructor() {
        this.list = [];
    }
    hasAgg() {
        return true;
    }
    addElement(num) {
        this.list.push(num);
    }
    calList(array) {
        return this._fun(array);
    }
    toString() {
        return 'AggFun';
    }
}
exports.default = AggFun;
