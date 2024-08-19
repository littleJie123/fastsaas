"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOpControl_1 = __importDefault(require("./BaseOpControl"));
class default_1 extends BaseOpControl_1.default {
    async doExecute() {
        let data = await this.getData();
        let num = await this.getDao().update(data, this.getDataCdt());
        if (num == 0) {
            throw new Error('数据不合法');
        }
        return data;
    }
}
exports.default = default_1;
