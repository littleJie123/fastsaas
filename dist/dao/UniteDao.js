"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = __importDefault(require("./query/Query"));
/**
 * 将多个dao的查询结果合并，并支持在合并结果上分页
 */
class UniteDao {
    constructor(opt) {
        this.opt = opt;
    }
    async findCnt(query) {
        query = Query_1.default.parse(query);
        let cnt = 0;
        let prevDao = null;
        let prevQuery = query;
        for (let dao of this.getDaos()) {
            let daoQuery = await this.parseDaoQuery(query, dao, prevDao, prevQuery);
            cnt += await dao.findCnt(daoQuery);
            prevDao = dao;
            prevQuery = daoQuery;
        }
        return cnt;
    }
    async find(query) {
        query = Query_1.default.parse(query).clone();
        if (!this.hasPage(query)) {
            return await this.findWithoutPage(query);
        }
        return await this.findByPage(query);
    }
    async findData(query) {
        return this.find(query);
    }
    getPojoIdCol() {
        let daos = this.getDaos();
        if (daos == null || daos.length == 0) {
            return null;
        }
        return daos[0].getPojoIdCol();
    }
    getDaos() {
        if (this.opt == null || this.opt.daos == null) {
            return [];
        }
        return this.opt.daos;
    }
    hasPage(query) {
        let pager = query.getPager();
        return pager != null && pager.rp != null && pager.rp !== '';
    }
    async findWithoutPage(query) {
        let ret = [];
        let prevDao = null;
        let prevQuery = query;
        for (let dao of this.getDaos()) {
            let daoQuery = await this.parseDaoQuery(query, dao, prevDao, prevQuery);
            let list = await dao.find(daoQuery);
            if (list != null && list.length > 0) {
                ret.push(...list);
            }
            prevDao = dao;
            prevQuery = daoQuery;
        }
        return ret;
    }
    async findByPage(query) {
        let pager = query.getPager();
        let first = this.toNum(pager.first, 0);
        let rp = this.toNum(pager.rp, 0);
        let ret = [];
        let prevDao = null;
        let prevQuery = query;
        for (let dao of this.getDaos()) {
            let pageQuery = this.buildPageQuery(query, first, rp);
            let daoQuery = await this.parseDaoQuery(pageQuery, dao, prevDao, prevQuery);
            let list = await dao.find(daoQuery);
            if (list == null) {
                list = [];
            }
            if (list.length >= rp) {
                ret.push(...list.slice(0, rp));
                return ret;
            }
            if (list.length == 0) {
                let cnt = await dao.findCnt(daoQuery);
                first = first - cnt;
            }
            else {
                ret.push(...list);
                rp = rp - list.length;
                first = 0;
            }
            prevDao = dao;
            prevQuery = daoQuery;
        }
        return ret;
    }
    /**
     * parseQueryByDatas只影响当前dao，传给下一个dao仍是原来的query
     */
    async parseDaoQuery(query, dao, prevDao, prevQuery) {
        let daoQuery = query.clone();
        if (dao.parseQueryByDatas == null) {
            return daoQuery;
        }
        let list = [];
        if (prevDao != null && prevDao.findAllDatas != null) {
            list = await prevDao.findAllDatas(prevQuery);
            if (list == null) {
                list = [];
            }
        }
        let parsed = dao.parseQueryByDatas(daoQuery, list);
        if (parsed == null) {
            return daoQuery;
        }
        return parsed;
    }
    buildPageQuery(query, first, rp) {
        let pageQuery = query.clone();
        pageQuery.first(first);
        pageQuery.size(rp);
        return pageQuery;
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
exports.default = UniteDao;
