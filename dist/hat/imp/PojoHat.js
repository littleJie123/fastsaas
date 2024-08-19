"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../util/ArrayUtil");
const StrUtil_1 = require("./../../util/StrUtil");
/**
 * 基于新结构的hat
 */
class default_1 {
    constructor(opt) {
        this.opt = opt;
        if (opt.overrideFuns != null) {
            for (let e in opt.overrideFuns) {
                this[e] = opt.overrideFuns[e];
            }
        }
    }
    getContext() {
        return this.opt.context;
    }
    getSearcher() {
        let opt = this.opt;
        return this.getContext().get(`${opt.key}Searcher`);
    }
    getDao() {
        let opt = this.opt;
        return this.getContext().get(`${opt.key}Dao`);
    }
    /**
     * 返回hat table的主键
     * @returns
     */
    getColOfHatTable() {
        let dao = this.getDao();
        return dao.getPojoIdCol();
    }
    /**
     * 查询 hat 表里面的数据
     * @param list
     * @returns
     */
    async findDatasFromHatTable(list) {
        let col = this.getColOfHatTable();
        let ids = ArrayUtil_1.ArrayUtil.toArrayDis(list, col);
        if (col.endsWith('Id')) {
            return this.getSearcher().findByIds(ids);
        }
        else {
            return this.getDao().find({ [col]: ids });
        }
    }
    /**
     * 构建 帽子数据的map
     * @param list
     * @returns
     */
    async buildHatMap(list) {
        let datas = await this.findDatasFromHatTable(list);
        let pk = this.getColOfHatTable();
        let datasMap = ArrayUtil_1.ArrayUtil.toMapByKey(datas, pk);
        return datasMap;
    }
    async process(list) {
        let datasMap = await this.buildHatMap(list);
        let pk = this.getColOfHatTable();
        let ret = [];
        for (let row of list) {
            let hatData = datasMap[row[pk]];
            let retData = null;
            if (hatData == null) {
                hatData = this.getDefHatData(row);
            }
            if (hatData != null) {
                retData = this.doProcessHatData(row, hatData);
            }
            if (retData == null) {
                ret.push(row);
            }
            else {
                ret.push(retData);
            }
        }
        return ret;
    }
    /**
     * 处理一条记录
     * @param data
     * @param hatData
     * @returns
     */
    doProcessHatData(data, hatData) {
        if (this.opt.fun == null) {
            return this.processData(data, hatData);
        }
        else {
            return this.opt.fun(data, hatData);
        }
    }
    /**
     * 处理一条记录,可以重载
     * @param data
     * @param hatData
     * @returns
     */
    processData(data, hatData) {
        let name = this.getHatNameCol();
        data[name] = hatData['name'] || hatData[name];
        return null;
    }
    /**
     * 返回拼接到data上name到值，可以重载
     * @returns
     */
    getHatNameCol() {
        return StrUtil_1.StrUtil.changeUnderStringToCamel(this.opt.key + 'Name');
    }
    /**
     * 构建数据库中没有查到数据的默认数据
     * @param row
     * @returns
     */
    getDefHatData(row) {
        return null;
    }
}
exports.default = default_1;
