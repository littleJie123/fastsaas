"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayCdt_1 = __importDefault(require("../ArrayCdt"));
const JsonUtil_1 = __importDefault(require("./../../../../util/JsonUtil"));
class AndCdt extends ArrayCdt_1.default {
    toSql(colChanger) {
        return this.toSqlStr('and', colChanger);
    }
    toEs() {
        let q = {};
        for (let cdt of this._array) {
            JsonUtil_1.default.add(q, ['bool', 'must'], cdt.toEs());
        }
        return q;
    }
    isHit(obj) {
        var ret = true;
        for (var cdt of this._array) {
            if (!cdt.isHit(obj)) {
                ret = false;
                break;
            }
        }
        return ret;
    }
}
exports.default = AndCdt;
