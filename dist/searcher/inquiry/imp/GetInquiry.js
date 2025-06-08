"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseInquiry_1 = __importDefault(require("../BaseInquiry"));
class default_1 extends BaseInquiry_1.default {
    constructor(opt) {
        super(opt);
    }
    async _findFromDb(params) {
        let param = params[0];
        let ret = await this._opt.fun(param);
        return [{
                param,
                data: ret
            }];
    }
    acqDataCode(data) {
        return this.acqCode(data.param);
    }
    acqCode(param) {
        if (this._opt.paramFun) {
            return this._opt.paramFun(param);
        }
        else {
            if (param == null) {
                return '';
            }
            return param.toString();
        }
    }
}
exports.default = default_1;
