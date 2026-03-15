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
            pageSize: 5000,
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
                if (result === null || result === void 0 ? void 0 : result.stop) {
                    return;
                }
            }
        }
    }
    async doProcess(list) {
        return this.opt.process(list);
    }
    async findList(list) {
        let query = this.buildQuery();
        let col = this.getCol();
        if (list != null && list.length > 0) {
            let pkCol = this.getPkCol();
            if (col == pkCol) {
                query.big(col, list[list.length - 1][col]);
            }
            else {
                query.bigEq(col, list[list.length - 1][col]);
                let andCdt = new fastsaas_1.AndCdt();
                andCdt.eq(col, list[list.length - 1][col]);
                andCdt.lessEq(pkCol, list[list.length - 1][pkCol]);
                query.addCdt(new fastsaas_1.NotCdt(andCdt));
            }
        }
        return this.getDao().find(query);
    }
    getDao() {
        return this.opt.context.get(this.opt.tableName + 'Dao');
    }
    buildQuery() {
        let query = fastsaas_1.Query.parse(this.opt.query);
        if (this.opt.colArray != null) {
            query.col(this.opt.colArray);
        }
        query.size(this.opt.pageSize);
        let col = this.getCol();
        if (col == this.getPkCol()) {
            query.order(col);
        }
        else {
            query.addOrder(col);
            query.addOrder(this.getPkCol());
        }
        return query;
    }
    getCol() {
        let col = this.opt.sortCol;
        if (col == null) {
            col = this.getPkCol();
        }
        return col;
    }
    getPkCol() {
        return fastsaas_1.StrUtil.firstLower(fastsaas_1.StrUtil.changeUnderStringToCamel(this.opt.tableName) + 'Id');
    }
}
exports.default = BatchRunner;
