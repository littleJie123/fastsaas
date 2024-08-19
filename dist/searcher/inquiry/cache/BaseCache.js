"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCache {
    constructor() {
    }
    setInquiry(baseInquiry) {
        this._inquiry = baseInquiry;
    }
    /**
     * 通过查询的参数删除缓存
     * @param params
     * @returns
     */
    async removeCache(params) {
        if (params == null)
            return;
        if (!(params instanceof Array))
            params = [params];
        if (params.length == 0)
            return;
        var keys = this._parseKeyArray(params);
        keys = ArrayUtil_1.ArrayUtil.distinct(keys);
        await this._removeCache(keys);
    }
    _parseKeyArray(params) {
        var inquiry = this._inquiry;
        return ArrayUtil_1.ArrayUtil.parse(params, (param) => {
            return inquiry.acqDataCode(param);
        });
    }
    setKey(key) {
        this._key = key;
    }
    async saveArray(opts, dbs) {
        var inquiry = this._inquiry;
        var map = ArrayUtil_1.ArrayUtil.toMapArray(dbs, data => inquiry.acqDataCode(data));
        for (var opt of opts) {
            var key = inquiry.acqCode(opt);
            var val = map[key];
            if (val == null)
                val = [];
            await this.save(key, val);
        }
    }
    async onlySaveArray(dbs) {
        var inquiry = this._inquiry;
        var map = ArrayUtil_1.ArrayUtil.toMapArray(dbs, data => inquiry.acqDataCode(data));
        for (var key in map) {
            var val = map[key];
            await this.save(key, val);
        }
    }
    /**
    返回结果
    {
      ret, //从缓存中查出的结果
      list //从缓存中找不到的key值
    }
    */
    async find(optArray) {
        let ret = [];
        let notArray = [];
        for (let opt of optArray) {
            let optRet = await this.get(opt);
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
    async _find(hasArray) {
        var ret = [];
        for (var i = 0; i < hasArray.length; i++) {
            var key = hasArray[i];
            ArrayUtil_1.ArrayUtil.addAll(ret, await this.get(key));
        }
        return ret;
    }
    _acqKey() {
        return this._inquiry.getKey();
    }
}
exports.default = BaseCache;
const ArrayUtil_1 = require("./../../../util/ArrayUtil");
