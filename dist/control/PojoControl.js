"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOpControl_1 = __importDefault(require("./BaseOpControl"));
class default_1 extends BaseOpControl_1.default {
    async doExecute(req, resp) {
        let searcher = this.getSearcher();
        let pkCol = this.getPkCol();
        let pojo = await searcher.getById(this._param[pkCol]);
        if (pojo != null && this.checkDataCdt(pojo)) {
            await this.processPojo(pojo);
        }
    }
    checkDataCdt(pojo) {
        let dataCdt = this.getDataCdt();
        if (dataCdt != null) {
            for (let e in dataCdt) {
                if (dataCdt[e] != pojo[e]) {
                    return false;
                }
            }
        }
        return true;
    }
    needCheckName() {
        return false;
    }
}
exports.default = default_1;
