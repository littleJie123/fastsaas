"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../util/ArrayUtil");
const CsvUtil_1 = __importDefault(require("./../util/CsvUtil"));
const ListControl_1 = __importDefault(require("./ListControl"));
const Query_1 = __importDefault(require("./../dao/query/Query"));
/**
 * 做group by的control
 */
class GroupControl extends ListControl_1.default {
    /**
     * group 字段
     * _orderArray 设置排序
     */
    acqGroup() {
        return null;
    }
    /**
     * 处理当前页数据
     * @param list
     */
    async _processPageList(list) {
        return list;
    }
    /**
     * 默认分页数
     */
    acqDefPageSize() {
        if (this._needPager()) {
            return 1500;
        }
        return 0;
    }
    /**
     * 是否设置数据库排序
     * @returns
     */
    _needOrder() {
        //通过first进行拉取
        return this._param._first != null;
    }
    /**
     * 是否设置数据库排序
     * @returns
     */
    _needPager() {
        //通过first进行拉取
        return this._param._first != null;
    }
    /**
     * 内存排序
     * @param list
     */
    _pageOrder(list) {
        if (!this._needOrder()) {
            var param = this._param;
            if (param.orderBy) {
                ArrayUtil_1.ArrayUtil.order(list, {
                    order: param.orderBy,
                    desc: param.desc
                });
            }
            if (this._orderArray) {
                var orders = [];
                for (var i = 0; i < this._orderArray.length; i++) {
                    var item = this._orderArray[i];
                    orders.push({ order: item.col, desc: item.desc });
                }
                ArrayUtil_1.ArrayUtil.order(list, orders);
            }
        }
    }
    async addOrder(query) {
        if (!this._needOrder()) {
            return;
        }
        return await super.addOrder(query);
    }
    async addCdt(query) {
        var arrayCdt = this._arrayCdt;
        var param = this._param;
        for (var e in param) {
            if (arrayCdt == null || !ArrayUtil_1.ArrayUtil.inArray(arrayCdt, e)) {
                query.addCdt(await this.buildCdt(e, param[e]));
            }
        }
    }
    async buildQuery() {
        var query = await super.buildQuery();
        var group = this.acqGroup();
        if (group) {
            query.group(group);
        }
        return query;
    }
    /**
    * 使用findData 函数
    */
    useFindData() {
        return false;
    }
    async find(query) {
        let list = await this.findByDao(query);
        return list;
    }
    /**
     * 内存过滤
     * @param list
     */
    async _filterByArrayCdt(list) {
        var arrayCdt = this._arrayCdt;
        if (arrayCdt == null)
            return list;
        var array = [];
        var param = this._param;
        var query = new Query_1.default();
        for (var e of arrayCdt) {
            if (param[e] != null) {
                query.addCdt(await this.buildCdt(e, param[e]));
            }
        }
        for (var data of list) {
            if (query.isHit(data)) {
                array.push(data);
            }
        }
        return array;
    }
    async doExecute() {
        if (this.isDownload()) {
            let query = await this.buildQuery();
            let list = await this.find(query);
            let processedList = await this._processList(list);
            if (processedList != null) {
                list = processedList;
            }
            list = await this._filterByArrayCdt(list);
            processedList = await this._processPageList(list);
            if (processedList != null) {
                list = processedList;
            }
            return CsvUtil_1.default.toBuffer(list, this.getDownloadCols());
        }
        else {
            this._initPager();
            let query = await this.buildQuery();
            let map = {};
            map.list = await this.find(query);
            let processedList = await this._processList(map.list);
            if (processedList != null) {
                map.list = processedList;
            }
            map.list = await this._filterByArrayCdt(map.list);
            if (!this._onlySch) {
                this._pageOrder(map.list);
                await this.schCnt(map, query);
                this.slice(map);
            }
            if (this._processPageList) {
                let processedList = await this._processPageList(map.list);
                if (processedList != null) {
                    map.list = processedList;
                }
            }
            this._calPager(map);
            return map;
        }
    }
    /**
     * 搜索数量和值
     * @param map
     * @param query
     */
    async schCnt(map, query) {
        if (!this.isOnlySch()) {
            map.totalElements = map.list.length;
        }
    }
    /**
     * 内存中分页
     * @param map
     */
    slice(map) {
        if (!this._needPager()) {
            var pager = this.acqPager();
            if (pager != null) {
                map.list = map.list.slice(pager.first, pager.last);
            }
        }
    }
    acqPager() {
        var param = this._param;
        if (!param.pageSize)
            return null;
        let pageNo = 1;
        if (this.firstPageIsZero()) {
            pageNo = 0;
        }
        var len = parseInt(param.pageSize);
        var first;
        if (param._first != null) {
            first = param._first;
        }
        else {
            if (param.pageNo != null) {
                pageNo = parseInt(param.pageNo);
            }
            if (!this.firstPageIsZero())
                first = (pageNo - 1) * len;
            else
                first = pageNo * len;
        }
        var last = first + len;
        return {
            first: first,
            last: last
        };
    }
    /**
     * setPage 注销掉，因为group 必须查询所有数据才知道数量
     * @param query
     */
    _setPage(query) {
        if (this._needPager()) {
            super._setPage(query);
        }
    }
}
exports.default = GroupControl;
