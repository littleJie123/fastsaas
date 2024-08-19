"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AggFun_1 = __importDefault(require("../AggFun"));
class AvgFun extends AggFun_1.default {
    _fun() {
        let sum = 0;
        if (this.list.length == 0)
            return 0;
        for (let obj of this.list) {
            sum += obj;
        }
        return sum / this.list.length;
    }
    clone() {
        return new AvgFun();
    }
}
exports.default = AvgFun;
