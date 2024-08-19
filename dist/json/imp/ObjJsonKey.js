"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonKey_1 = __importDefault(require("../JsonKey"));
class default_1 extends JsonKey_1.default {
    _parse(keys) {
        this._keys = keys.split('#');
    }
    _acqKey() {
        return this._keys[0];
    }
    _enter(result) {
        return this._next.change(result[this._keys[0]]);
    }
    _change(result) {
        var keys = this._keys;
        for (var key of keys) {
            if (result[key] != null)
                this._fun(result, key, result[key]);
        }
        return result;
    }
}
exports.default = default_1;
