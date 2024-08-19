"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TimeLink_1 = __importDefault(require("./TimeLink"));
/**
 * 一个数据结构，记录按时间保存的次数，在空间复杂度和时间复杂度上做的最好
 */
class TimeCnt {
    constructor(opt) {
        this.timeLink = new TimeLink_1.default(opt);
    }
    /**
     * 增加数量
     * @param n
     */
    add(n) {
        if (n == null)
            n = 1;
        return this.timeLink.add(n, (n1, n2) => n1 + n2);
    }
    get() {
        let sum = 0;
        let datas = this.timeLink.get();
        for (let data of datas) {
            sum += data;
        }
        return sum;
    }
}
exports.default = TimeCnt;
