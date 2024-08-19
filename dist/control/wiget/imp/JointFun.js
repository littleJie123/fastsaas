"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../../util/ArrayUtil");
const JointWiget_1 = __importDefault(require("../JointWiget"));
/**
 * 执行函数的联合表
 */
class default_1 extends JointWiget_1.default {
    constructor() {
        super(...arguments);
        this.params = [];
    }
    async find() {
        if (this.params.length == 0)
            return null;
        let param = {};
        for (let p of this.params) {
            param[p.key] = p.value;
        }
        let list = await this.opt.fun(param);
        let tableCol = this.opt.tableCol;
        if (tableCol != null) {
            list = ArrayUtil_1.ArrayUtil.toArrayDis(list, tableCol);
        }
        return list;
    }
    async addParam(key, value, cdtFun) {
        this.params.push({ key, value });
    }
}
exports.default = default_1;
