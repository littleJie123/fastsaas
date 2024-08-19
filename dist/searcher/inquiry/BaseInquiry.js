"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapCache_1 = __importDefault(require("./cache/imp/MapCache"));
/**
 * 查询的父类
 * async _findDefDatas(params:Array<any>);//产生查询结果没有时候的默认值
 * async _parseResult(data) //更改查询数据
 */
class BaseInquiry {
    constructor(opt) {
        if (opt == null) {
            opt = {};
        }
        this._opt = opt;
    }
    get(key) {
        return this._opt[key];
    }
    acqSchCols() {
        let opt = this._opt;
        return opt.schCols;
    }
    /**
     * 注册的时候设置查询列
     * @param cols
     */
    setSchColsOnReg(cols) {
        let opt = this._opt;
        if (opt.schCols == null) {
            opt.schCols = cols;
        }
    }
    acqCache() {
        if (this._cache == null) {
            let opt = this._opt;
            if (opt.cache != null) {
                this._cache = opt.cache;
            }
            else {
                this._cache = new MapCache_1.default();
            }
            this._cache.setInquiry(this);
        }
        return this._cache;
    }
    couldSaveAll() {
        return true;
    }
    _checkOtherCdt(data) {
        var otherCdt = this.acqOtherCdt();
        var query = Query_1.default.parse(otherCdt);
        return otherCdt == null
            || query.isHit(data);
    }
    /**
     * 清空缓存
     */
    clearCache() {
        var cache = this.acqCache();
        cache.clearCache();
    }
    /**
     * 查询数据
     * @param params:Array|any 查询条件，支持数组或单个
     * @param col:可空。null的话返回整条数据，不为null则返回一个只有该字段的数组
     * 不能改成any[] 会导致老代码编译不通过
     *
     */
    async find(params, col) {
        if (params == null) {
            return [];
        }
        if (params instanceof Array && params.length == 0) {
            return [];
        }
        if (!(params instanceof Array))
            params = [params];
        params = this._parseOpt(params);
        var retList = null;
        retList = await this._findArray(params);
        retList = this._addDefData(retList, params);
        retList = this.parseRsult(retList);
        if (col != null) {
            retList = ArrayUtil_1.ArrayUtil.toArray(retList, col);
        }
        return retList;
    }
    _addDefData(list, opt) {
        var funKey = '_findDefDatas';
        if (this[funKey]) {
            if (!(opt instanceof Array)) {
                opt = [opt];
            }
            let notOpt = this._findNotOpt(list, opt);
            if (notOpt.length > 0) {
                var array = this[funKey](notOpt, list);
                if (array != null && !(array instanceof Array))
                    array = [array];
                if (array != null && array.length > 0) {
                    if (list == null)
                        list = [];
                    ArrayUtil_1.ArrayUtil.addAll(list, array);
                }
            }
        }
        let opts = this._opt;
        if (opts.findDefDatas) {
            if (!(opt instanceof Array)) {
                opt = [opt];
            }
            let notOpt = this._findNotOpt(list, opt);
            if (notOpt.length > 0) {
                var array = opts.findDefDatas(notOpt, list);
                if (array != null && !(array instanceof Array))
                    array = [array];
                if (array != null && array.length > 0) {
                    if (list == null)
                        list = [];
                    ArrayUtil_1.ArrayUtil.addAll(list, array);
                }
            }
        }
        return list;
    }
    _findNotOpt(list, opt) {
        if (list == null)
            list = [];
        var array = ArrayUtil_1.ArrayUtil.notInByKey(opt, list, (data) => this.acqCode(data), (data) => this.acqDataCode(data));
        return array;
    }
    parseRsult(list) {
        var funKey = '_parseResult';
        if (this[funKey]) {
            var array = [];
            for (var data of list) {
                array.push(this[funKey](data));
            }
            return array;
        }
        return list;
    }
    /**
     * 返回其他条件
     */
    acqOtherCdt() {
        return this._opt['otherCdt'];
    }
    /**
     * 返回查询的表名
     */
    getKey() {
        return this._opt['key'];
    }
    setKey(key) {
        this._opt['key'] = key;
        var cache = this.acqCache();
        cache.setKey(key);
    }
    getContext() {
        return this._opt.context;
    }
    setContext(context) {
        this._opt.context = context;
    }
    getDao() {
        let key = this.getKey();
        return this.getContext().get(key + 'dao');
    }
    changeDbArray2Pojo(datas) {
        let dao = this.getDao();
        return dao.changeDbArray2Pojo(datas);
    }
    /**
     * 能否传入一个数组直接保存
     * 如果需要关联表的则不行
     */
    _couldSave() {
        return true;
    }
    async save(array) {
        if (!this._couldSave()) {
            return false;
        }
        var self = this;
        var map = ArrayUtil_1.ArrayUtil.toMapArray(array, function (data) {
            return self.acqDataCode(data);
        });
        for (var e in map) {
            await this._save(e, map[e]);
        }
    }
    async _save(e, list) {
        if (e != null) {
            var cache = this.acqCache();
            await cache.save(e, list);
        }
    }
    _hasFindArray() {
        return true;
    }
    _parseOpt(params) {
        return params;
    }
    async _findArray(params) {
        var self = this;
        var cache = this.acqCache();
        var ret = [];
        var optArray = ArrayUtil_1.ArrayUtil.parse(params, function (data) {
            return self.acqCode(data);
        });
        var obj = await cache.find(optArray);
        ArrayUtil_1.ArrayUtil.addAll(ret, obj.ret);
        var notArray = obj.list;
        if (notArray.length > 0) {
            var notMap = ArrayUtil_1.ArrayUtil.toMap(notArray);
            notArray = ArrayUtil_1.ArrayUtil.filter(params, function (data) {
                return notMap[self.acqCode(data)];
            });
            var dbs = await this._findFromDb(notArray);
            await this.saveArray(notArray, dbs);
            ArrayUtil_1.ArrayUtil.addAll(ret, dbs);
        }
        return ret;
    }
    async saveArray(params, dbs) {
        if (!this._couldSave()) {
            return false;
        }
        var cache = this.acqCache();
        await cache.saveArray(params, dbs);
    }
    _getFromCacheByArray(array) {
        var ret = [];
        var self = this;
        array = ArrayUtil_1.ArrayUtil.parse(array, function (data) {
            return self.acqCode(data);
        });
        //var map = this._map
        var cache = this.acqCache();
        for (var key of array) {
            ret.push(cache.get(key));
        }
        return ret;
    }
    acqDataFromCache(param, col) {
        let ret = null;
        let cache = this.acqCache();
        if (!(param instanceof Array)) {
            let code = this.acqCode(param);
            ret = cache.get(code);
        }
        else {
            ret = [];
            for (let p of param) {
                let code = this.acqCode(p);
                ArrayUtil_1.ArrayUtil.addAll(ret, cache.get(code));
            }
        }
        ret = this._addDefData(ret, param);
        if (col != null) {
            ret = ArrayUtil_1.ArrayUtil.toArray(ret, col);
        }
        return ret;
    }
    /**
     * 仅仅从缓存查找
     * 不建议使用
     * 使用acqDataFromcache
     */
    acqFromCache(params) {
        return this._getFromCacheByArray(params);
    }
    async removeCache(list) {
        var cache = this.acqCache();
        await cache.removeCache(list);
    }
    async one(params) {
        var list = await this.find(params);
        return list[0];
    }
}
exports.default = BaseInquiry;
const Query_1 = __importDefault(require("../../dao/query/Query"));
const ArrayUtil_1 = require("./../../util/ArrayUtil");
