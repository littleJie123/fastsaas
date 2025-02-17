"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
/**
 * 批量运行
 */
class BatchRunner {
    constructor(opt) {
        this.opt = {
            ...this.getInit(),
            ...opt
        };
    }
    getInit() {
        return {
            pageSize: 1000,
            query: {}
        };
    }
    isOver(list) {
        if (list == null) {
            return false;
        }
        return list.length < this.opt.pageSize;
    }
    async process() {
        let list = null;
        let cnt = 0;
        while (!this.isOver(list)) {
            list = await this.findList(list);
            if (list.length > 0) {
                let result = await this.doProcess(list);
                cnt += list.length;
                let col = this.getCol();
                console.log(`已经处理${this.opt.tableName} ${cnt}条记录`);
                console.log(`最后一条记录的id为${list[list.length - 1][col]}`);
                if (result === null || result === void 0 ? void 0 : result.stop) {
                    console.log(`====================${this.opt.tableName}处理完成 =============================`);
                    return;
                }
            }
        }
        console.log(`====================${this.opt.tableName}处理完成 =============================`);
    }
    async doProcess(list) {
        return this.opt.process(list);
    }
    async findList(list) {
        let query = this.buildQuery();
        let col = this.getCol();
        if (list != null && list.length > 0) {
            query.big(col, list[list.length - 1][col]);
        }
        return this.getDao().find(query);
    }
    getDao() {
        return this.opt.context.get(this.opt.tableName + 'Dao');
    }
    buildQuery() {
        let query = new fastsaas_1.Query(this.opt.query);
        if (this.opt.colArray != null) {
            query.col(this.opt.colArray);
        }
        query.size(this.opt.pageSize);
        let col = this.getCol();
        query.order(col);
        return query;
    }
    getCol() {
        let col = this.opt.col;
        if (col == null) {
            col = this.opt.tableName + 'Id';
        }
        return col;
    }
}
exports.default = BatchRunner;
