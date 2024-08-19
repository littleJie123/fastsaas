"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseInquiry_1 = __importDefault(require("../BaseInquiry"));
const ArrayUtil_1 = require("./../../../util/ArrayUtil");
class TablesInquiry extends BaseInquiry_1.default {
    constructor(opt) {
        super(opt);
    }
    acqDataCode(data) {
        throw new Error("不需要实现");
    }
    acqCode(param) {
        throw new Error("不需要实现");
    }
    /**
     * 第一步查询
    子类重写,从另外一个searcher 里面找
    */
    _findFromOtherSearcher(params) {
        let otherSearcher = this.getSearcher(this.getOtherTable());
        return otherSearcher.get(this.getOtherName()).find(params);
    }
    getOtherTable() {
        let opt = this._opt;
        if (opt.otherTable == null) {
            throw new Error('otherTable 没有指定');
        }
        return opt.otherTable;
    }
    getOtherName() {
        let opt = this._opt;
        if (opt.otherName == null) {
            throw new Error('otherName 没有指定');
        }
        return opt.otherName;
    }
    _getName() {
        var opt = this._opt;
        return opt.name;
    }
    getSearcher(key) {
        var context = this.getContext();
        return context.get(key + 'searcher');
    }
    _findArray(params) {
        if (this._couldSave()) {
            return super._findArray(params);
        }
        else {
            return this._findFromDb(params);
        }
    }
    _parseOther(datas) {
        let opt = this._opt;
        if (opt.otherCol == null) {
            return datas;
        }
        return ArrayUtil_1.ArrayUtil.toArray(datas, opt.otherCol);
    }
    /**
     * 做一个完整的查询
     * @param params
     */
    async _findFromDb(params) {
        if (!(params instanceof Array)) {
            params = [params];
        }
        let otherDatas = await this._findFromOtherSearcher(params);
        let datas = this._parseOther(otherDatas);
        let list = await this._find(datas, params);
        list = this.combineData(list, otherDatas);
        return await this._addDefData(list, datas);
    }
    /**
     * 合并两个表查询出来对数据
     * @param list 主表的数据
     * @param otherDatas 中间表的数据
     */
    combineData(list, otherDatas) {
        return list;
    }
    /**
     * 第二步查询
     * @param datas 从别的表查询出来的数据
     * @param opt  原始查询数据
     */
    async _find(datas, opt) {
        if (datas == null || datas.length == 0)
            return [];
        var context = this.getContext();
        var searcher = context.get(this.getKey() + 'searcher');
        var name = this._getName();
        if (name == null) {
            return await searcher.findByIds(datas);
        }
        else {
            return await searcher.get(name).find(datas);
        }
    }
    acqDataFromCache(params, col) {
        if (this._couldSave()) {
            return super.acqDataFromCache(params, col);
        }
        else {
            let otherSearcher = this.getSearcher(this.getOtherTable());
            let list = otherSearcher.get(this.getOtherName()).acqDataFromCache(params);
            list = this._parseOther(list);
            return this._acqFromSearcherCache(list, col);
        }
    }
    _acqFromSearcherCache(datas, col) {
        var context = this.getContext();
        var searcher = context.get(this.getKey() + 'searcher');
        var name = this._getName();
        if (name == null) {
            return searcher.findByIdsFromCache(datas, col);
        }
        else {
            return searcher.get(name).acqDataFromCache(datas, col);
        }
    }
    _couldSave() {
        return false;
    }
}
exports.default = TablesInquiry;
