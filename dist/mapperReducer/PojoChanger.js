"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PojoChanger {
    constructor(oldPojo, newPojo) {
        this.oldPojo = oldPojo;
        this.newPojo = newPojo;
    }
    getChangeValue(key) {
        var _a, _b;
        return ((_a = this.newPojo[key]) !== null && _a !== void 0 ? _a : 0) - ((_b = this.oldPojo[key]) !== null && _b !== void 0 ? _b : 0);
    }
    static sum(list, key) {
        let sum = 0;
        for (let row of list) {
            sum + row.getChangeValue(key);
        }
        return sum;
    }
    static sumObj(list, keys) {
        let sum = {};
        for (let key of keys) {
            sum[key] = 0;
        }
        for (let row of list) {
            for (let key of keys) {
                sum[key] += row.getChangeValue(key);
            }
        }
        return sum;
    }
}
exports.default = PojoChanger;
