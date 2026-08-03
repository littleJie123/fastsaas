"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NumUtil_1 = __importDefault(require("../util/NumUtil"));
const ValueType_1 = __importDefault(require("./ValueType"));
class default_1 extends ValueType_1.default {
    isHit(val) {
        return NumUtil_1.default.isNum(val);
    }
    isEq(val1, val2) {
        return NumUtil_1.default.isEq(val1, val2);
    }
}
exports.default = default_1;
