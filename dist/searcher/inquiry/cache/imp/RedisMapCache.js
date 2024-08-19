"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../../../util/ArrayUtil");
const BaseCache_1 = __importDefault(require("../BaseCache"));
const MapCache_1 = __importDefault(require("./MapCache"));
const RedisCache_1 = __importDefault(require("./RedisCache"));
/**
 * 内存cache 和 redis cache 的结合
 */
class default_1 extends BaseCache_1.default {
    constructor(opt) {
        super();
        this._opt = opt;
        this._mapCache = new MapCache_1.default();
        this._redisCache = new RedisCache_1.default();
        this._redisCache.fun(opt.funName);
    }
    async _removeCache(keys) {
        this._mapCache.removeCache(keys);
        this._redisCache.removeCache(keys);
    }
    setInquiry(inquiry) {
        this._mapCache.setInquiry(inquiry);
        this._redisCache.setInquiry(inquiry);
    }
    setKey(key) {
        this._mapCache.setKey(key);
        this._redisCache.setKey(key);
        return this;
    }
    clearCache() {
        this._mapCache.clearCache();
        this._redisCache.clearCache();
    }
    async save(e, list) {
        var mapCache = this._mapCache;
        var redisCache = this._redisCache;
        await mapCache.save(e, list);
        await redisCache.save(e, list);
    }
    /**
     * 仅仅给不需要promise的方法用 不支持
     * @param e
     */
    get(e) {
        throw new Error("不支持该方法");
    }
    /**
     转化后的key值
    */
    async find(optArray) {
        var mapCache = this._mapCache;
        var array = [];
        var ret = await mapCache.find(optArray);
        if (ret.list == null || ret.list.length == 0)
            return ret;
        ArrayUtil_1.ArrayUtil.addAll(array, ret.ret);
        var redisCache = this._redisCache;
        var redisRet = await redisCache.findRedis(ret.list);
        var noArray = [];
        for (var i = 0; i < redisRet.length; i++) {
            var retRow = redisRet[i];
            var opt = ret.list[i];
            if (retRow == null) {
                noArray.push(opt);
            }
            else {
                await mapCache.save(opt, retRow);
                ArrayUtil_1.ArrayUtil.addAll(array, retRow);
            }
        }
        return {
            ret: array,
            list: noArray
        };
    }
    async saveArray(opts, array) {
        await this._mapCache.saveArray(opts, array);
        await this._redisCache.saveArray(opts, array);
    }
    async removeCache(opts) {
        await this._mapCache.removeCache(opts);
        await this._redisCache.removeCache(opts);
    }
}
exports.default = default_1;
