"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSafeHttp_1 = __importDefault(require("./BaseSafeHttp"));
class default_1 extends BaseSafeHttp_1.default {
    getMethod() {
        return 'get';
    }
    needChangeHeader() {
        return false;
    }
    needWriteBody() {
        return false;
    }
    needChangeUrl() {
        return true;
    }
}
exports.default = default_1;
