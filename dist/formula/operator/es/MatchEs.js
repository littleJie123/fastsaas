"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EsOp_1 = __importDefault(require("./EsOp"));
class MatchEs extends EsOp_1.default {
    getTerm(col, val) {
        return 'term';
    }
}
exports.default = MatchEs;
