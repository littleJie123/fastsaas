"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../util/ArrayUtil");
const CsvUtil_1 = __importDefault(require("./../util/CsvUtil"));
const Cdt_1 = __importDefault(require("./../dao/query/cdt/imp/Cdt"));
const AndCdt_1 = __importDefault(require("./../dao/query/cdt/imp/AndCdt"));
const OrCdt_1 = __importDefault(require("./../dao/query/cdt/imp/OrCdt"));
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
         * 增加排序字段
         *  [{
                order:'sort',desc:'desc'
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
    addTableCdt(table, cdt) {
        if (cdt != null) {
            if (this._tableCdts == null) {
                this._tableCdts = {};
            }
            let array = this._tableCdts[table];
            if (array == null) {
                array = [];
                this._tableCdts[table] = array;
            }
            array.push(cdt);
        }
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
     * 是否需要 _processList（关联表等后处理）。
     * `_onlyId` 时只取主键，跳过关联查询以节省性能。
     */
    needProcessList() {
        var _a;
        return !((_a = this._param) === null || _a === void 0 ? void 0 : _a._onlyId);
    }
    /**
    返回查询字段
    */
    acqCol() {
        var _a;
        if ((_a = this._param) === null || _a === void 0 ? void 0 : _a._onlyId) {
            return [this.getDao().getPojoIdCol()];
        }
        return null;
    }
    /**
     * 是否需要搜索数量
     * @returns
     */
    needSchCnt() {
        if (this._needCnt != null) {
            return this._needCnt;
        }
        return this._param._needCnt;
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
        // cdts 为通用查询条件，不受 _schCols / _noSchCols 限制
        if (e == 'cdts') {
            return this.doBuildCdt(e, val);
        }
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
    async doBuildCdt(e, val) {
        if (e == 'cdts') {
            return this.buildCdtItems(val);
        }
        let newVal = this.getSchVal(e, val);
        if (newVal == null) {
            return null;
        }
        return new Cdt_1.default(this.getCol(e), newVal, this.getOp(e));
    }
    doGetCdtTableMap() {
        return null;
    }
    /**
     *
     * @param item
     */
    getTableByCdt(item) {
        let map = this.doGetCdtTableMap();
        if (map == null) {
            return null;
        }
        for (let e in map) {
            let array = map[e];
            if (array != null && item.col != null && array.includes(item.col)) {
                return e;
            }
        }
        return null;
    }
    /**
     * 将客户端传入的 cdts 转成 OrCdt / AndCdt。
     * 值直接使用原值，不走 getSchVal。
     */
    async buildCdtItems(cdts) {
        if (cdts == null || cdts.array == null || cdts.array.length == 0) {
            return null;
        }
        let arrayCdt = this.createArrayCdt(cdts.op);
        for (let item of cdts.array) {
            let cdt = await this.buildCdtItem(item);
            let table = this.getTableByCdt(item);
            if (table == null) {
                arrayCdt.addCdt(cdt);
            }
            else {
                this.addTableCdt(table, cdt);
            }
        }
        return arrayCdt.isValid() ? arrayCdt : null;
    }
    getCdtFunMap() {
        return null;
    }
    async buildCdtItem(item) {
        if (item == null) {
            return null;
        }
        let op = item.op;
        if (op == 'or' || op == 'and') {
            if (item.array == null || item.array.length == 0) {
                return null;
            }
            let arrayCdt = this.createArrayCdt(op);
            for (let child of item.array) {
                arrayCdt.addCdt(await this.buildCdtItem(child));
            }
            return arrayCdt.isValid() ? arrayCdt : null;
        }
        if (item.col == null || item.value == null) {
            return null;
        }
        let map = this.getCdtFunMap();
        if (map != null && map[item.col] != null) {
            let fun = map[item.col];
            return fun(item);
        }
        let value = item.value;
        if (op == 'like') {
            value = this.formatLikeValue(value);
        }
        // Cdt 构造：op 空时，数组默认 in，否则 =
        return new Cdt_1.default(item.col, value, op);
    }
    /**
     * like 的 value：未含 % 时左右补 %；已有 % 则原样使用。
     */
    formatLikeValue(value) {
        if (value == null || typeof value != 'string') {
            return value;
        }
        if (value.indexOf('%') >= 0) {
            return value;
        }
        return `%${value}%`;
    }
    createArrayCdt(op) {
        if (op == 'and') {
            return new AndCdt_1.default();
        }
        return new OrCdt_1.default();
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
     * 返回分页大小。`_onlyId` 时返回 0（SQL 不加 LIMIT，拉全量主键）。
     */
    getPageSize() {
        var _a;
        if ((_a = this._param) === null || _a === void 0 ? void 0 : _a._onlyId) {
            return 0;
        }
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
    /**
     * `_onlyId` 时返回 0（与 getPageSize 配合，不分页）。
     */
    getFirst() {
        var _a;
        if ((_a = this._param) === null || _a === void 0 ? void 0 : _a._onlyId) {
            return 0;
        }
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
        var col = param._onlyId
            ? [this.getDao().getPojoIdCol()]
            : this.acqCol();
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
        this.addNotInIdsCdt(query);
        await this.processSchCdt(query);
        await this.addTableCdtToQuery(query);
        return query;
    }
    getDataCdt() {
        return this.dataCdt;
    }
    async addTableCdtToQuery(query) {
        var _a;
        if (this._tableCdts != null) {
            for (let table in this._tableCdts) {
                let array = this._tableCdts[table];
                if (array.length > 0) {
                    let arrayCdt = this.createArrayCdt((_a = this._param) === null || _a === void 0 ? void 0 : _a.cdts.op);
                    let opt = { isDel: 0 };
                    let dataCdt = this.getDataCdt();
                    if (dataCdt != null) {
                        opt = dataCdt.getOtherCdt();
                    }
                    let tableQuery = new Query_1.default(opt);
                    for (let cdt of array) {
                        arrayCdt.addCdt(cdt);
                    }
                    if (arrayCdt.isValid()) {
                        tableQuery.addCdt(arrayCdt);
                    }
                    let dao = this._context.get(table + 'Dao');
                    let pojoPk = dao.getPojoIdCol();
                    //tableQuery.col(pojoPk);
                    let ids = await dao.findCol(tableQuery, pojoPk);
                    query.in(pojoPk, ids);
                }
            }
        }
    }
    /**
     * 反选排除：`_notInIds` 非空时加「主键 not in _notInIds」
     */
    addNotInIdsCdt(query) {
        var _a;
        let notInIds = (_a = this._param) === null || _a === void 0 ? void 0 : _a._notInIds;
        if (notInIds == null || !(notInIds instanceof Array) || notInIds.length == 0) {
            return;
        }
        query.notIn(this.getDao().getPojoIdCol(), notInIds);
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
                    let itemStr = item;
                    if (fastsaas_1.StrUtil.isStr(itemStr)) {
                        query.addOrder(itemStr);
                    }
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
        if (this.needProcessList()) {
            var processedList = await this._processList(list);
            if (processedList != null) {
                list = processedList;
            }
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
    async buildDownloadBuffer(list, downloadInfo) {
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
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
        return 'download.xlsx';
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
__decorate([
    (0, fastsaas_1.Bean)()
], ListControl.prototype, "dataCdt", void 0);
