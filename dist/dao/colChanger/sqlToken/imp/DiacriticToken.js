"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlToken_1 = __importDefault(require("../SqlToken"));
class default_1 extends SqlToken_1.default {
    change(pojoToDbMap) {
        let chars = this.chars.slice(1, this.chars.length - 1).join('');
        if (pojoToDbMap[chars] != null) {
            let lastChar = this.getLastChar();
            let firstChar = this.chars[0];
            return `${firstChar}${pojoToDbMap[chars]}${lastChar}`;
        }
        else {
            return this.chars.join('');
        }
    }
    isEnd(c) {
        return this.chars.length > 1 && this.chars[0] == this.getLastChar();
    }
}
exports.default = default_1;
