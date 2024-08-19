"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AggFun_1 = __importDefault(require("../AggFun"));
class SumFun extends AggFun_1.default {
    clone() {
        return new SumFun();
    }
    _fun() {
        let sum = 0;
        for (let obj of this.list) {
            sum += obj;
        }
        return sum;
    }
}
exports.default = SumFun;
