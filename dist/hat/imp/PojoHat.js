"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hat_1 = __importDefault(require("./Hat"));
/**
 * 与hat的不同是，在主表中产生的数据是对象，不再只是name
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 */
class PojoHat extends Hat_1.default {
    _processData(data, hatData) {
        let dataCol = this.acqDataCol();
        data[this._opt.key] = {
            [dataCol]: hatData[dataCol],
            name: hatData.name
        };
    }
}
exports.default = PojoHat;
