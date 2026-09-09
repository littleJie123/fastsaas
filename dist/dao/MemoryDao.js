"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = __importDefault(require("./query/Query"));
/**
 * dao装饰器：先按query查出全部记录，再在内存中按page分页
 */
class MemoryDao {
    constructor(dao) {
        this.dao = dao;
    }
    async find(query) {
        await this.loadAll(query);
        return this.pageInMemory(query);
    }
    async findCnt(query) {
        await this.ensureArray(query);
        return this.array.length;
    }
    async findData(query) {
        return this.find(query);
    }
    getPojoIdCol() {
        return this.dao.getPojoIdCol();
    }
    /**
     * 返回上次查询的全量结果，避免再查一次
     */
    findAllDatas(query) {
        return this.array;
    }
    parseQueryByDatas(query, list) {
        if (this.dao.parseQueryByDatas == null) {
            return query;
        }
        return this.dao.parseQueryByDatas(query, list);
    }
    async ensureArray(query) {
        if (this.array == null) {
            await this.loadAll(query);
        }
    }
    async loadAll(query) {
        if (this.array == null) {
            query = Query_1.default.parse(query);
            let allQuery = query.clone();
            this.clearPage(allQuery);
            let list = await this.dao.find(allQuery);
            this.array = list == null ? [] : list;
        }
    }
    pageInMemory(query) {
        let list = this.array;
        if (list == null) {
            return [];
        }
        query = Query_1.default.parse(query);
        let pager = query.getPager();
        if (pager == null || pager.rp == null || pager.rp === '') {
            return list.slice();
        }
        let first = this.toNum(pager.first, 0);
        let rp = this.toNum(pager.rp, 0);
        return list.slice(first, first + rp);
    }
    clearPage(query) {
        let pager = query.getPager();
        if (pager == null) {
            return;
        }
        pager.rp = null;
        pager.first = null;
    }
    toNum(val, def) {
        if (val == null || val === '') {
            return def;
        }
        let num = parseInt(val);
        if (isNaN(num)) {
            return def;
        }
        return num;
    }
}
exports.default = MemoryDao;
