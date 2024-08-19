"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtil_1 = __importDefault(require("./../../../../util/JsonUtil"));
const ArrayCdt_1 = __importDefault(require("../ArrayCdt"));
class OrCdt extends ArrayCdt_1.default {
    toEs() {
        let q = {};
        for (let cdt of this._array) {
            JsonUtil_1.default.add(q, ['bool', 'should'], cdt.toEs());
        }
        return q;
    }
    toSql(colChanger) {
        return this.toSqlStr('or', colChanger);
    }
    isHit(obj) {
        var ret = false;
        for (var cdt of this._array) {
            if (cdt.isHit(obj)) {
                ret = true;
                break;
            }
        }
        return ret;
    }
}
exports.default = OrCdt;
