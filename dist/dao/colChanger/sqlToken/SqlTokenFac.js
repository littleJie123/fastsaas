"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiacriticToken_1 = __importDefault(require("./imp/DiacriticToken"));
const LettleToken_1 = __importDefault(require("./imp/LettleToken"));
const OtherToken_1 = __importDefault(require("./imp/OtherToken"));
const QuoteToken_1 = __importDefault(require("./imp/QuoteToken"));
const WhiteSpaceToken_1 = __importDefault(require("./imp/WhiteSpaceToken"));
const SqlTokenUtil_1 = __importDefault(require("./SqlTokenUtil"));
class default_1 {
    /**
     * 命中标准的
     * @param char
     */
    static hit(char) {
        if (SqlTokenUtil_1.default.isDiacritic(char)) {
            return new DiacriticToken_1.default();
        }
        if (SqlTokenUtil_1.default.isSingleQuote(char) || SqlTokenUtil_1.default.isDoubleQuote(char)) {
            return new QuoteToken_1.default();
        }
        if (SqlTokenUtil_1.default.isLetter(char)) {
            return new LettleToken_1.default();
        }
        if (SqlTokenUtil_1.default.isSpace(char)) {
            return new WhiteSpaceToken_1.default();
        }
        return new OtherToken_1.default();
    }
}
exports.default = default_1;
