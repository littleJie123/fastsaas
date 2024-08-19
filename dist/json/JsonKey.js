"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
function get(opt) {
    var keys = opt.keys;
    if (keys.substring(0, 1) == '$')
        return new ArrayJsonKey_1.default(opt);
    return new ObjJsonKey_1.default(opt);
}
class JsonKey {
    _enter(result) {
    }
    _change(result) {
    }
    _parse(keys) {
    }
    /**
    opt:{
      keys:['aa#bb'],
      fun:function
    }
    */
    constructor(opt) {
        this._fun = opt.fun;
        var keys = opt.keys;
        this._parse(keys);
    }
    setNext(next) {
        if (next != null) {
            this._next = next;
        }
    }
    change(result) {
        if (result == null)
            return;
        if (this._next) {
            var next = this._enter(result);
            if (this._acqKey() != null && next != null) {
                result[this._acqKey()] = next;
            }
        }
        else {
            this._change(result);
        }
        return result;
    }
    static get(str, fun) {
        if (fun == null) {
            fun = (obj, e, val) => console.log(e, ':', val);
        }
        var array = str.split('|');
        var list = [];
        for (var key of array) {
            key = StrUtil_1.StrUtil.trim(key);
            list.push(get({
                fun: fun,
                keys: key
            }));
        }
        for (var i = 0; i < list.length - 1; i++) {
            list[i].setNext(list[i + 1]);
        }
        return list[0];
    }
}
exports.default = JsonKey;
const StrUtil_1 = require("../util/StrUtil");
const ArrayJsonKey_1 = __importDefault(require("./imp/ArrayJsonKey"));
const ObjJsonKey_1 = __importDefault(require("./imp/ObjJsonKey"));
