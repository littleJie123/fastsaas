"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class default_1 {
    constructor(opt) {
        this.opt = opt;
    }
    /**
     * 根据key 从关联表加载数据
     * @param rows
     * @param opts
     */
    async load(rows, opts) {
        await this.loadCache(rows, opts);
        for (let row of rows) {
            let loadData = row;
            for (let opt of opts) {
                loadData = await this.doLoad(loadData, row, opt);
            }
        }
    }
    async doLoad(loadData, originalRow, opt) {
        if (loadData == null) {
            return null;
        }
        let geter = this.getIdGeter(opt);
        let id = fastsaas_1.ArrayUtil.get(loadData, geter);
        if (id == null) {
            return null;
        }
        let searcher = this.getSearcher(opt);
        let nextData = await searcher.getById(id);
        return await this.processData(loadData, nextData, originalRow, opt);
    }
    async processData(loadData, nextData, originalRow, opt) {
        if (opt.dataCols != null) {
            nextData = fastsaas_1.JsonUtil.onlyKeys(nextData, opt.dataCols);
        }
        if (opt.fun != null) {
            opt.fun(loadData, nextData, originalRow);
        }
        else {
            if (!opt.notToPre) {
                loadData[opt.table] = nextData;
            }
            if (opt.toOriginalRow) {
                originalRow[opt.table] = nextData;
            }
        }
        return nextData;
    }
    async loadCache(rows, opts) {
        for (let opt of opts) {
            let ids = this.getDataIds(rows, opt);
            let searcher = this.getSearcher(opt);
            rows = await searcher.findByIds(ids);
        }
    }
    getSearcher(opt) {
        return this.opt.context.get(opt.table + 'Searcher');
    }
    getDataIds(rows, opt) {
        let geter = this.getIdGeter(opt);
        return fastsaas_1.ArrayUtil.toArrayDis(rows, geter);
    }
    getIdGeter(opt) {
        var _a;
        return (_a = opt.idGeter) !== null && _a !== void 0 ? _a : fastsaas_1.StrUtil.firstLower(opt.table + 'Id');
    }
}
exports.default = default_1;
