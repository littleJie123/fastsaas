"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(daoHelper, tableName, cdt) {
        this.daoHelper = daoHelper;
        this.tableName = tableName;
        this.cdt = cdt;
    }
    getBeforeList() {
        return this.beforeList;
    }
    async before() {
        this.beforeList = await this.daoHelper.find(this.tableName, this.cdt);
    }
    async compare(fun) {
        if (this.beforeList == null) {
            throw new Error('请先调用before方法');
        }
        this.afterList = await this.daoHelper.find(this.tableName, this.cdt);
        fun(this.beforeList[0], this.afterList[0]);
    }
    async compareList(fun) {
        if (this.beforeList == null) {
            throw new Error('请先调用before方法');
        }
        this.afterList = await this.daoHelper.find(this.tableName, this.cdt);
        fun(this.beforeList, this.afterList);
    }
}
exports.default = default_1;
