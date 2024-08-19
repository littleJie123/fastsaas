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
    change(pojoToDbMap) {
        let chars = this.chars.join('');
        if (pojoToDbMap[chars] != null) {
            return pojoToDbMap[chars];
        }
        else {
            return this.chars.join('');
        }
    }
}
exports.default = default_1;
