"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inquiry_1 = __importDefault(require("./Inquiry"));
const ArrayUtil_1 = require("./../../../util/ArrayUtil");
const DateUtil_1 = require("./../../../util/DateUtil");
class KeysInquiry extends Inquiry_1.default {
    acqColKeys() {
        return this.get('keys');
    }
    _acqCodeByKeys(params) {
        var keys = this.acqColKeys();
        var code;
        var keyFun = this.get('keyFun');
        if (keyFun != null) {
            code = keyFun(params);
        }
        else {
            let opt = this._opt;
            if (keys != null) {
                var array = [];
                for (var i = 0; i < keys.length; i++) {
                    let val = params[keys[i]];
                    if (val == null) {
                        //throw new Error(keys[i]+'不存在!!'+JSON.stringify(params)+'的')
                        return null;
                    }
                    if (val instanceof Date) {
                        if (opt.onlyDate) {
                            val = DateUtil_1.DateUtil.format(val);
                        }
                        else {
                            val = DateUtil_1.DateUtil.formatDate(val);
                        }
                    }
                    array.push(val);
                }
                code = array.join('___');
            }
        }
        return code.toLowerCase();
    }
    acqCode(params) {
        var ret = this._acqCodeByKeys(params);
        return ret;
    }
    acqDataCode(data) {
        if (!this._checkOtherCdt(data)) {
            return null;
        }
        return this._acqCodeByKeys(data);
    }
    async _buildCdt(params) {
        var ret = await this._buildArrayCdt(params);
        return await this._addOtherCdt(ret);
    }
    async _findArray(params) {
        let keys = this.acqColKeys();
        for (let obj of params) {
            if (obj == null)
                throw new Error('参数不能为空');
            if (keys != null) {
                for (let key of keys) {
                    if (obj[key] == null) {
                        throw new Error(`参数的${key}为空`);
                    }
                }
            }
        }
        return super._findArray(params);
    }
    _buildArrayCdt(params) {
        return this._buildKeyCdt(params, 0);
    }
    _buildKeyCdt(array, index) {
        var keys = this.acqColKeys();
        var key = keys[index];
        if (index == keys.length - 1) {
            return new Cdt_1.default(key, ArrayUtil_1.ArrayUtil.toArrayDis(array, key));
        }
        else {
            var orCdt = new OrCdt_1.default();
            var map = ArrayUtil_1.ArrayUtil.toMapArray(array, key);
            for (var e in map) {
                var andCdt = new AndCdt_1.default();
                andCdt.eq(key, e);
                andCdt.addCdt(this._buildKeyCdt(map[e], index + 1));
                orCdt.addCdt(andCdt);
            }
            return orCdt;
        }
    }
}
exports.default = KeysInquiry;
const Cdt_1 = __importDefault(require("../../../dao/query/cdt/imp/Cdt"));
const AndCdt_1 = __importDefault(require("../../../dao/query/cdt/imp/AndCdt"));
const OrCdt_1 = __importDefault(require("../../../dao/query/cdt/imp/OrCdt"));
