"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hat_1 = __importDefault(require("./Hat"));
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
