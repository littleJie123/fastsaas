"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseInquiry_1 = __importDefault(require("../BaseInquiry"));
/**
 * 单条件查询
 */
class Inquiry extends BaseInquiry_1.default {
    async _findFromDb(params) {
        var query = new Query_1.default();
        query = await this.processQuery(query, params);
        var list = await this.getDao().find(query);
        return list;
    }
    acqDataCode(data) {
        if (this._checkOtherCdt(data)) {
            let val = data[this.acqCol()];
            if (val == null)
                return null;
            return val.toString().toLowerCase();
        }
        return null;
    }
    acqCode(param) {
        return param.toString().toLowerCase();
    }
    acqCol() {
        var opt = this._opt;
        return opt.col;
    }
    async processQuery(query, params) {
        query.addCdt(await this._buildCdt(params));
        let schCols = this.acqSchCols();
        query.col(schCols);
        return query;
    }
    /**
     * 构建查询条件
     * @param params
     */
    async _buildCdt(params) {
        var cdt = new Cdt_1.default(this.acqCol(), params);
        return await this._addOtherCdt(cdt);
    }
    async _addOtherCdt(optCdt) {
        var otherCdt = this.acqOtherCdt();
        if (otherCdt == null) {
            return optCdt;
        }
        else {
            var andCdt = new AndCdt_1.default();
            andCdt.addCdt(optCdt);
            if (otherCdt instanceof Array) {
                for (var cdt of otherCdt) {
                    andCdt.addCdt(cdt);
                }
            }
            else {
                if (otherCdt['clazz'] == 'BaseCdt') {
                    andCdt.addCdt(otherCdt);
                }
                else {
                    for (var e in otherCdt) {
                        andCdt.eq(e, otherCdt[e]);
                    }
                }
            }
            return andCdt;
        }
    }
}
exports.default = Inquiry;
const Query_1 = __importDefault(require("../../../dao/query/Query"));
const Cdt_1 = __importDefault(require("../../../dao/query/cdt/imp/Cdt"));
const AndCdt_1 = __importDefault(require("../../../dao/query/cdt/imp/AndCdt"));
