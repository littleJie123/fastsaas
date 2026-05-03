"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValueType_1 = __importDefault(require("./ValueType"));
class default_1 extends ValueType_1.default {
    isHit(val) {
        return val instanceof Date;
    }
    isEq(val1, val2) {
        return val1.getTime() == val2.getTime();
    }
}
exports.default = default_1;
