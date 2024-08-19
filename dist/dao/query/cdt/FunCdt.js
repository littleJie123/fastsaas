"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 只有内存查询才有用
 */
const BaseCdt_1 = __importDefault(require("./BaseCdt"));
class default_1 extends BaseCdt_1.default {
    constructor(fun) {
        super();
        this._fun = fun;
    }
    isHit(row) {
        return this._fun(row);
    }
    toEs() {
        throw new Error("toEs 不能被执行");
    }
    toSql() {
        throw new Error("toSql 不能被执行");
    }
}
exports.default = default_1;
