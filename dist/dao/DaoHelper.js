"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class DaoHelper {
    constructor(opt) {
        this.nameMaps = {};
        this.opt = opt;
    }
    async insertByNames(key, names) {
        let datas = names.map(name => ({ name }));
        let dao = this.getDao(key);
        await dao.addArray(datas);
        for (let data of datas) {
            this.saveToCache(key, data.name, data);
        }
    }
    async findCount(key, col, cdt) {
        let query = new fastsaas_1.Query();
        if (col == null) {
            query.col('count(*) as cnt');
        }
        else {
            query.col(`count(distinct ${col}) as cnt`);
        }
        query.addCdt(fastsaas_1.BaseCdt.parse(cdt));
        let list = await this.getDao(key).find(query);
        return list[0].cnt;
    }
    /**
     * 找到一个
     * @param key
     * @param query
     */
    async findOne(key, query) {
        let list = await this.find(key, query);
        return list[0];
    }
    /**
     * 增加数据
     * @param key
     * @param list
     */
    async addArray(key, list) {
        let dao = this.getDao(key);
        await dao.addArray(list);
    }
    async findSum(key, col, cdt) {
        let query = new fastsaas_1.Query();
        query.col(`sum(${col}) as cnt`);
        query.addCdt(fastsaas_1.BaseCdt.parse(cdt));
        let list = await this.getDao(key).findData(query);
        if (list.length == 0) {
            return 0;
        }
        return list[0].cnt;
    }
    /**
     * 根据条件和表格进行删除
     * @param key
     * @param query
     */
    async delByCdt(key, query) {
        let dao = this.getDao(key);
        await dao.delByCdt(query);
    }
    /**
     * 根据name进行查询并且放入缓存
     * @param key
     * @param names
     */
    async loadByNames(key, names, query) {
        if (query == null) {
            query = { name: names };
        }
        else {
            query = {
                ...query,
                name: names
            };
        }
        let datas = await this.find(key, query);
        this.nameMaps[key] = fastsaas_1.ArrayUtil.toMapByKey(datas, 'name');
    }
    /**
     * 根据id查询
     * @param key
     * @param id
     * @returns
     */
    async getById(key, id) {
        return this.getSearcher(key).getById(id);
    }
    async findByIds(key, ids) {
        return this.getSearcher(key).findByIds(ids);
    }
    getSearcher(key) {
        return this.opt.context.get(key + "Searcher");
    }
    async getByName(key, name, query) {
        let data = this.getFromCache(key, name);
        if (data == null) {
            data = await this.getByDb(key, name, query);
            if (data != null) {
                this.saveToCache(key, name, data);
            }
        }
        return data;
    }
    saveToCache(key, name, data) {
        let cache = this.getCacheMap(key);
        cache[name] = data;
    }
    getCacheMap(key) {
        let cacheMap = this.nameMaps[key];
        if (cacheMap == null) {
            cacheMap = {};
            this.nameMaps[key] = cacheMap;
        }
        return cacheMap;
    }
    getFromCache(key, name) {
        var _a;
        let data = (_a = this.nameMaps[key]) === null || _a === void 0 ? void 0 : _a[name];
        return data;
    }
    async getByDb(key, name, query) {
        if (query == null) {
            query = { name };
        }
        else {
            query = {
                ...query,
                name
            };
        }
        let list = await this.find(key, query);
        return list[0];
    }
    async find(key, query) {
        let dao = this.getDao(key);
        let list = await dao.find(query);
        list = list.filter(row => row.isDel != 1);
        return list;
    }
    getDao(key) {
        return this.opt.context.get(key + "Dao");
    }
}
exports.default = DaoHelper;
