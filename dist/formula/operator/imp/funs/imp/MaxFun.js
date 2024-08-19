"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AggFun_1 = __importDefault(require("../AggFun"));
class MaxFun extends AggFun_1.default {
    clone() {
        return new MaxFun();
    }
    _fun() {
        let sum = null;
        for (let obj of this.list) {
            if (sum == null || obj > sum)
                sum = obj;
        }
        return sum;
    }
}
exports.default = MaxFun;
