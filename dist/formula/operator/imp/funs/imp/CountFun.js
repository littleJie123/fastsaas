"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AggFun_1 = __importDefault(require("../AggFun"));
class CountFun extends AggFun_1.default {
    constructor() {
        super(...arguments);
        this.noEsEgg = true;
        this.backetPath = '_count';
    }
    _fun(array) {
        return array.length;
    }
    clone() {
        return new CountFun();
    }
}
exports.default = CountFun;
