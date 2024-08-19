"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hat_1 = __importDefault(require("./Hat"));
class SearcherHat extends Hat_1.default {
    constructor(opt) {
        super(opt);
    }
    _parseListToParam(list) {
        var array = [];
        for (var data of list) {
            let param = this._parseData(data);
            if (param != null)
                array.push(param);
        }
        return array;
    }
    _parseData(data) {
        var opt = this._opt;
        if (opt.dataCol) {
            return data[opt.dataCol];
        }
        return data;
    }
    async _schMap(list) {
        if (list.length == 0)
            return {};
        var opt = this._opt;
        var searcher = this.getSearcher();
        var funName = opt.funName;
        var params = this._parseListToParam(list);
        //导入searcher缓存
        let retList = await searcher.get(funName).find(params);
        await this._afterSearch(params, retList);
        return {};
    }
    async _acqHatData(data, map) {
        var opt = this._opt;
        var funName = opt.funName;
        var searcher = this.getSearcher();
        var list = await searcher.get(funName).find(this._parseData(data));
        var opt = this._opt;
        if (opt.needOne) {
            return list[0];
        }
        return list;
    }
    _acqFastHatData(data, map) {
        var opt = this._opt;
        var funName = opt.funName;
        var searcher = this.getSearcher();
        return searcher.get(funName).acqDataFromCache(this._parseData(data));
    }
    async _afterSearch(params, retList) {
    }
    _processData(data, hatData) {
        var opt = this._opt;
        if (opt.needOne) {
            data._data = hatData;
        }
        else {
            data._array = hatData;
        }
    }
}
exports.default = SearcherHat;
