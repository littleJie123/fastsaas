"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inquiry_1 = __importDefault(require("./Inquiry"));
const Query_1 = __importDefault(require("./../../../dao/query/Query"));
const ArrayUtil_1 = require("./../../../util/ArrayUtil");
class ProxyInquiry extends Inquiry_1.default {
    couldSaveAll() {
        return false;
    }
    _couldSave() {
        return false;
    }
    async find(param, col) {
        if (param == null)
            return [];
        if (!(param instanceof Array)) {
            param = [param];
        }
        if (param.length == 0)
            return [];
        var context = this.getContext();
        var list;
        var opt = this._opt;
        var searcher = context.get(this.getKey() + 'searcher');
        if (opt.funName) {
            var opt = this._opt;
            list = await searcher[opt.funName](param);
        }
        else {
            list = await searcher.findByIds(param);
        }
        let retList = this._filter(list);
        if (col != null)
            retList = ArrayUtil_1.ArrayUtil.toArray(retList, col);
        return retList;
    }
    _filter(list) {
        var opt = this._opt;
        if (opt.fun) {
            return ArrayUtil_1.ArrayUtil.filter(list, opt.fun);
        }
        if (opt.otherCdt) {
            let array = [];
            var otherCdt = this.acqOtherCdt();
            var query = Query_1.default.parse(otherCdt);
            for (let row of list) {
                if (query.isHit(row)) {
                    array.push(row);
                }
            }
            return array;
        }
        return list;
    }
    acqDataFromCache(param) {
        let context = this.getContext();
        var searcher = context.get(this.getKey() + 'searcher');
        let inquiry = null;
        if (opt.funName) {
            var opt = this._opt;
            inquiry = searcher.get(opt.funName);
        }
        else {
            inquiry = searcher.get('getById');
        }
        let list = inquiry.acqDataFromCache(param);
        return this._filter(list);
    }
}
exports.default = ProxyInquiry;
