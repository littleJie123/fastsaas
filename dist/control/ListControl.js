"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../util/ArrayUtil");
const CsvUtil_1 = __importDefault(require("./../util/CsvUtil"));
const Cdt_1 = __importDefault(require("./../dao/query/cdt/imp/Cdt"));
const Query_1 = __importDefault(require("./../dao/query/Query"));
const Control_1 = __importDefault(require("./Control"));
const fastsaas_1 = require("../fastsaas");
/**
 * 参数__download不为空，则转为下载
 * 查询（不包括group by）的控制类
 */
class ListControl extends Control_1.default {
    constructor() {
        super(...arguments);
        /**
         * 开关，不需要查询条件
         */
        this._noCdt = false;
        /**
         * 开关，不需要查询数量
         */
        this._needCnt = false;
        /**
         * 增加排序字段
         *  [{
                col:'sort',desc:'desc'
            }]
         */
        this._orderArray = null;
        /*
        指定只有_schCols 才产生的查询条件
        */
        this._schCols = null;
        /*
        指定_noSchCols 中不要产生查询条件
        */
        this._noSchCols = null;
        /**
         * 查询 计算符 > <
         * {
         *  begin:'>',
         * end:'<'
         * }
         */
        this._opMap = null;
        /**
         * 查询字段转化map
         * {
         *  begin:'gmt_crete',
         * end:'gmt_create'
         * }
         */
        this._colMap = null;
        /**
         * 查询值转化的map
         */
        this._valueMap = null;
        /**
         * 默认查询类型，可以是Array,结构体{store_id：330108}或者BaseCdt的实例
         *
         */
        this._schCdt = null;
    }
    getTableName() {
        return null;
    }
    /**
     * 返回查询负责的dao
     */
    getDao() {
        let tableName = this.getTableName();
        if (tableName == null) {
            throw new Error('必须冲载getTableName');
        }
        let context = this.getContext();
        return context.get(tableName + 'dao');
    }
    ;
    /**
     * 对查询结果的后处理
     * @param list
     */
    async _processList(list) {
        return list;
    }
    /**
     返回查询字段
    */
    acqCol() {
        return null;
    }
    /**
     * 是否需要搜索数量
     * @returns
     */
    needSchCnt() {
        return this._needCnt;
    }
    /**
     * 是否需要排序
     */
    _needOrder() {
        return true;
    }
    /**
     根据params的列和值构建某个条件
    */
    async buildCdt(e, val) {
        if (e.substring(0, 1) == '_')
            return null;
        if (val == null) {
            return null;
        }
        if (this._noCdt)
            return null;
        if (this._schCols != null) {
            if (typeof this._schCols == 'string')
                this._schCols = [this._schCols];
            if (this._schCols instanceof Array) {
                this._schCols = ArrayUtil_1.ArrayUtil.toMap(this._schCols);
            }
            if (this._schCols[e] == null) {
                return null;
            }
        }
        if (this._noSchCols != null) {
            if (typeof this._noSchCols == 'string')
                this._noSchCols = [this._noSchCols];
            if (this._noSchCols instanceof Array) {
                this._noSchCols = ArrayUtil_1.ArrayUtil.toMap(this._noSchCols);
            }
            if (this._noSchCols[e]) {
                return null;
            }
        }
        if (e == 'desc' || e == 'orderBy' || e == 'pageNo' || e == 'pageSize') {
            return null;
        }
        return this.doBuildCdt(e, val);
    }
    doBuildCdt(e, val) {
        let newVal = this.getSchVal(e, val);
        if (newVal == null) {
            return null;
        }
        return new Cdt_1.default(this.getCol(e), newVal, this.getOp(e));
    }
    getSchVal(e, val) {
        if (this._valueMap != null) {
            let func = this._valueMap[e];
            if (func) {
                return func(val);
            }
        }
        return val;
    }
    /**
     * 产生一个like查询语句
     * @param field
     * @param val
     */
    like(field, val, onlyLeft) {
        if (val == null || val == '')
            return null;
        if (onlyLeft) {
            return new Cdt_1.default(field, val + '%', 'like');
        }
        else {
            return new Cdt_1.default(field, '%' + val + '%', 'like');
        }
    }
    /**
     * 返回分页大小
     */
    getPageSize() {
        var param = this._param;
        if (param.pageSize == null) {
            return this.acqDefPageSize();
        }
        return parseInt(param.pageSize);
    }
    /**
     * 设置分页
     * @param query
     */
    _setPage(query) {
        if (!this.isDownload()) {
            query.size(this.getPageSize());
            query.first(this.getFirst());
        }
    }
    getFirst() {
        var param = this._param;
        if (param._first != null) {
            return parseInt(param._first);
        }
        if (param.pageNo != null) {
            let pageNo = parseInt(param.pageNo);
            return (pageNo - 1) * this.getPageSize();
        }
        return 0;
    }
    /**
    构建查询
    */
    async buildQuery() {
        var query = new Query_1.default();
        let param = this._param;
        if (param == null) {
            param = {};
        }
        this._setPage(query);
        var col = this.acqCol();
        if (col) {
            query.col(col);
        }
        if (this._needOrder()) {
            //从参数中设置排序
            query.order(param.orderBy, param.desc);
        }
        //设置预定于的排序条件
        await this.addOrder(query);
        await this.addCdt(query);
        await this.processSchCdt(query);
        return query;
    }
    /**
     * 增加查询条件
     * @param query
     */
    async addCdt(query) {
        var param = this._param;
        for (var e in param) {
            query.addCdt(await this.buildCdt(e, param[e]));
        }
    }
    /**
     * 增加排序
     * @param query
     */
    async addOrder(query) {
        if (this._orderArray) {
            for (var i = 0; i < this._orderArray.length; i++) {
                var item = this._orderArray[i];
                if (item.order != null) {
                    query.addOrder(item.order, item.desc);
                }
                else {
                    query.addOrder(item);
                }
            }
        }
    }
    /**
     * 返回默认的查询条件
     */
    acqDefPageSize() {
        return 800;
    }
    /**
     * 处理this._schCdt
     * @param {[type]} query         [description]
     * @yield {[type]} [description]
     */
    async processSchCdt(query) {
        if (this._schCdt) {
            if (this._schCdt instanceof Array) {
                for (var cdt of this._schCdt) {
                    if (!(cdt.clazz == 'BaseCdt')) {
                        if (cdt.col != null) {
                            query.addCdt(new Cdt_1.default(cdt.col, cdt.value, cdt.op));
                        }
                        else {
                            query.addCdt(cdt);
                        }
                    }
                    else {
                        query.addCdt(cdt);
                    }
                }
            }
            else {
                if (this._schCdt.clazz == 'BaseCdt') {
                    query.addCdt(this._schCdt);
                }
                else {
                    for (var e in this._schCdt) {
                        query.addCdt(new Cdt_1.default(e, this._schCdt[e]));
                    }
                }
            }
        }
    }
    getCol(name) {
        if (this._colMap == null)
            return name;
        var ret = this._colMap[name];
        if (ret == null)
            ret = name;
        return ret;
    }
    /**
     * 使用findData 函数
     */
    useFindData() {
        return false;
    }
    /**
    返回关联表
    */
    getOp(name) {
        if (this._opMap == null)
            return null;
        return this._opMap[name];
    }
    async findByDao(query) {
        if (this.useFindData()) {
            return this.getDao().findData(query);
        }
        return this.getDao().find(query);
    }
    async find(query) {
        if (query == null) {
            return [];
        }
        var list = await this.findByDao(query);
        var processedList = await this._processList(list);
        if (processedList != null) {
            list = processedList;
        }
        return list;
    }
    async findCnt(query) {
        if (query == null) {
            return 0;
        }
        return await this.getDao().findCnt(query);
    }
    async schCnt(map, query) {
        map.totalElements = await this.findCnt(query);
    }
    /**
     * 判断当前请求是否下载
     */
    isDownload() {
        return this._param.__download != null;
    }
    getDownloadCols() {
        return [];
    }
    async download() {
        this._param.pageSize = null;
        var query = await this.buildQuery();
        let list = await this.find(query);
        return this.buildDownloadBuffer(list, await this.buildDownloadInfo());
    }
    async buildDownloadInfo() {
        return null;
    }
    buildDownloadBuffer(list, downloadInfo) {
        return CsvUtil_1.default.toBuffer(list, this.getDownloadCols());
    }
    async doExecute() {
        if (this.isDownload()) {
            return await this.download();
        }
        else {
            let map = await this.findData();
            return map;
        }
    }
    async findData() {
        var query = await this.buildQuery();
        let map = {};
        if (query != null) {
            map.content = this.onlyCols(await this.find(query));
        }
        else {
            map.content = [];
        }
        if (this.needSchCnt()) {
            await this.schCnt(map, query);
        }
        map.first = this.getFirst();
        map.pageSize = this.getPageSize();
        return map;
    }
    _sendResp(resp, ret) {
        if (this.isDownload()) {
            resp.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + this.getDownloadFileName(),
                'Content-Length': ret.length
            });
            resp.send(ret);
        }
        else {
            return super._sendResp(resp, ret);
        }
    }
    getDownloadFileName() {
        return 'export.csv';
    }
    getOnlyCols() {
        return null;
    }
    onlyCols(list) {
        let cols = this.getOnlyCols();
        return fastsaas_1.JsonUtil.onlyKeys4List(list, cols);
    }
}
exports.default = ListControl;
