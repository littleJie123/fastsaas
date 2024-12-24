"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fastsaas_1 = require("../fastsaas");
const fs_1 = __importDefault(require("fs"));
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
        let dao = this.getDao(key);
        let obj = await dao.findOne(query);
        return obj;
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
    async update(key, obj) {
        let dao = this.getDao(key);
        await dao.update(obj);
    }
    async findSum(key, col, cdt) {
        let query = fastsaas_1.Query.parse(cdt);
        query.col(`sum(${col}) as cnt`);
        // query.addCdt(BaseCdt.parse(cdt));
        let list = await this.getDao(key).findData(query);
        if (list.length == 0) {
            return 0;
        }
        return list[0].cnt;
    }
    async findSumByCols(key, cols, cdt) {
        let query = new fastsaas_1.Query();
        query.col(cols.map((col) => {
            if (col.indexOf(' as ') == -1) {
                return `sum(${col}) as ${col}`;
            }
            else {
                return col;
            }
        }));
        query.addCdt(fastsaas_1.BaseCdt.parse(cdt));
        let list = await this.getDao(key).findData(query);
        return list[0];
    }
    /**
     * 根据条件进行更新
     * @param cdt
     * @param data
     */
    async updateByCdt(key, whereCdt, data) {
        if (whereCdt == null || data == null) {
            return;
        }
        let dao = this.getDao(key);
        await dao.updateByCdt(whereCdt, data);
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
    /**
     * 导出json
     * @param tableName
     * @param schCdt
     * @param fileName
     */
    async exportJson(tableName, schCdt, fileName) {
        let list = await this.findBySchCdt(tableName, schCdt);
        //写入文件，没有文件则新增一个
        if (!fs_1.default.existsSync(fileName)) {
            //写一段代码，如果上述目录不存在则创建目录
            let dir = path_1.default.dirname(fileName);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
        }
        fs_1.default.writeFileSync(fileName, JSON.stringify({ list, schCdt }, null, 2));
    }
    async findBySchCdt(tableName, schCdt) {
        let dao = this.getDao(tableName);
        let retList;
        if (schCdt.sql == null) {
            retList = await dao.find(schCdt.cdt);
        }
        else {
            retList = await dao.executeSql(schCdt.sql);
            retList = dao.changeDbArray2Pojo(retList);
        }
        for (let row of retList) {
            for (let e in row) {
                if (row[e] instanceof Date) {
                    row[e] = fastsaas_1.DateUtil.formatDate(row[e]);
                }
            }
        }
        return retList;
    }
    /**
     * 导入json
     * @param tableName
     * @param fileName
     */
    async importJson(tableName, fileName) {
        let data = fs_1.default.readFileSync(fileName, 'utf8');
        let obj = JSON.parse(data);
        let list = obj.list;
        let schCdt = obj.schCdt;
        let dao = this.getDao(tableName);
        let self = this;
        let pkCol = `${tableName}Id`;
        await dao.onlyArray({
            mapFun: pkCol,
            array: list,
            async finds() {
                let dbList = await self.findBySchCdt(tableName, schCdt);
                let notIds = fastsaas_1.ArrayUtil.notInByKey(list, dbList, pkCol);
                dbList.push(...(await dao.findByIds(fastsaas_1.ArrayUtil.toArray(notIds, pkCol))));
                return dbList;
            },
            async adds(list) {
                await dao.importArray(list);
                return list;
            },
            needDel: true,
            needUpdate: true
        });
    }
}
exports.default = DaoHelper;
