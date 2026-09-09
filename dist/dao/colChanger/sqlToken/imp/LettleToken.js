"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlToken_1 = __importDefault(require("../SqlToken"));
const SqlTokenUtil_1 = __importDefault(require("../SqlTokenUtil"));
class default_1 extends SqlToken_1.default {
    isEnd(c) {
        return !SqlTokenUtil_1.default.isNumber(c) && !SqlTokenUtil_1.default.isLetter(c);
    }
    /**
     * 返回标识符字段
     */
    getField() {
        return this.chars.join('');
    }
    /**
     * 直接返回新的 db 字段
     * @param dbField
     */
    changeByDbField(dbField) {
        return dbField;
    }
}
exports.default = default_1;
