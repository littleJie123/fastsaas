"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlToken_1 = __importDefault(require("../SqlToken"));
/**
 * 类似`dbcol`
 */
class default_1 extends SqlToken_1.default {
    /**
     * 返回反引号中的字段
     */
    getField() {
        return this.chars.slice(1, this.chars.length - 1).join('');
    }
    /**
     * 用新的 db 字段包上原来的反引号
     * @param dbField
     */
    changeByDbField(dbField) {
        let lastChar = this.getLastChar();
        let firstChar = this.chars[0];
        return `${firstChar}${dbField}${lastChar}`;
    }
    isEnd(c) {
        return this.chars.length > 1 && this.chars[0] == this.getLastChar();
    }
}
exports.default = default_1;
