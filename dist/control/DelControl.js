"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOpControl_1 = __importDefault(require("./BaseOpControl"));
class default_1 extends BaseOpControl_1.default {
    /**
     * 默认false，也就是逻辑删除
     * @returns
     */
    needDel() {
        return false;
    }
    needCheckName() {
        return false;
    }
    async doExecute() {
        let pk = await this.getPkData();
        let num = 1;
        if (this.needDel()) {
            num = await this.getDao().del(pk, this.getDataCdt());
        }
        else {
            num = await this.getDao().update({
                ...pk,
                isDel: 1
            }, this.getDataCdt());
        }
        if (num == 0) {
            throw new Error('数据不合法');
        }
        return pk;
    }
}
exports.default = default_1;
