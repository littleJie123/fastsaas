"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
const ValueType_1 = __importDefault(require("./ValueType"));
class default_1 extends ValueType_1.default {
    isHit(val) {
        return fastsaas_1.StrUtil.isStr(val);
    }
    isEq(val1, val2) {
        return val1 === val2;
    }
}
exports.default = default_1;
