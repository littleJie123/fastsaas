"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../fastsaas");
const imp_1 = require("./cdt/imp");
/**
 * 查询关联表的时候，聚合多个id的查询，避免多个in查询
 */
class InIdsCdtBuilder {
    constructor(col) {
        this.col = col;
    }
    addIds(ids) {
        if (this.ids == null) {
            this.ids = ids;
        }
        else {
            this.ids = fastsaas_1.ArrayUtil.and(this.ids, ids);
        }
    }
    build() {
        if (this.ids == null) {
            return null;
        }
        return new imp_1.Cdt(this.col, this.ids);
    }
}
exports.default = InIdsCdtBuilder;
