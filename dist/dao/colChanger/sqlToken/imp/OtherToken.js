"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlToken_1 = __importDefault(require("../SqlToken"));
class default_1 extends SqlToken_1.default {
    isEnd(c) {
        return true;
    }
}
exports.default = default_1;
