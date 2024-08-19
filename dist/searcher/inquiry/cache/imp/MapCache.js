"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../../../util/ArrayUtil");
const BaseCache_1 = __importDefault(require("../BaseCache"));
class MapCache extends BaseCache_1.default {
    constructor() {
        super(...arguments);
        this._map = {};
    }
    async find(optArray) {
        if (optArray.length > 1)
            optArray = ArrayUtil_1.ArrayUtil.distinct(optArray);
        let ret = [];
        let notArray = [];
        let map = this._map;
        for (let opt of optArray) {
            let optRet = map[opt];
            if (optRet != null) {
                ArrayUtil_1.ArrayUtil.addAll(ret, optRet);
            }
            else {
                notArray.push(opt);
            }
        }
        return {
            ret,
            list: notArray
        };
    }
    async clearCache() {
        this._map = {};
    }
    _getMap() {
        return this._map;
    }
    //兼容性考虑
    acqKeys() {
        var map = this._getMap();
        var array = [];
        for (var e in map) {
            array.push(e);
        }
        return array;
    }
    async save(e, list) {
        var map = this._getMap();
        map[e] = list;
    }
    get(e) {
        var map = this._getMap();
        return map[e];
    }
    async _removeCache(array) {
        var map = this._getMap();
        for (var row of array) {
            delete map[row];
        }
    }
    saveArray(opts, dbs) {
        var inquiry = this._inquiry;
        //var map = ArrayUtil.toMapArray(dbs,data=>inquiry.acqDataCode(data));
        let map = this._map;
        for (var opt of opts) {
            var key = inquiry.acqCode(opt);
            map[key] = [];
        }
        for (let row of dbs) {
            let rowKey = inquiry.acqDataCode(row);
            let array = map[rowKey];
            if (array == null) {
                array = [];
                map[rowKey] = array;
            }
            array.push(row);
        }
    }
}
exports.default = MapCache;
