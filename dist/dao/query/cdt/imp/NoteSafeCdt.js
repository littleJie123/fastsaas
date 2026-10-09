"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 调用方标明不做注入检查的条件。
 * 字段仍走 quoteField / changeSql，操作符按传入原文写入 SQL。
 * 不能用来承接客户端输入。
 */
const Cdt_1 = __importDefault(require("./Cdt"));
class NoteSafeCdt extends Cdt_1.default {
    resolveSqlOp() {
        return this.getOp();
    }
}
exports.default = NoteSafeCdt;
