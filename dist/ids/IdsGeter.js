"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../util/ArrayUtil");
const Cdt_1 = __importDefault(require("./../dao/query/cdt/imp/Cdt"));
const NotCdt_1 = __importDefault(require("./../dao/query/cdt/imp/NotCdt"));
class default_1 {
    constructor(fun) {
        if (fun != null) {
            this.fun = fun;
        }
        else {
            this.fun = (id) => id;
        }
    }
    /**
     * 往id里面增加
     * @param ids
     */
    add(ids) {
        if (ids != null) {
            if (this.ids == null) {
                this.ids = ids;
            }
            else {
                this.ids = ArrayUtil_1.ArrayUtil.andByKey(this.ids, ids, this.fun);
            }
        }
    }
    /**
     * 往not in的结果表里面增加
     * @param ids
     */
    addNotIn(ids) {
        if (ids != null) {
            if (this.notInIds == null) {
                this.notInIds = ids;
            }
            else {
                this.notInIds = ArrayUtil_1.ArrayUtil.orByKey(this.notInIds, ids, this.fun);
            }
        }
    }
    /**
     * 返回结果，表示是not in 还是in
     */
    getResult() {
        if (this.ids == null && this.notInIds == null) {
            return null;
        }
        if (this.ids != null) {
            let ids = this.ids;
            if (this.notInIds != null) {
                ids = ArrayUtil_1.ArrayUtil.notInByKey(ids, this.notInIds, this.fun);
            }
            return { ids, notIn: false };
        }
        else {
            if (this.notInIds != null) {
                if (this.notInIds.length == 0)
                    return null;
                return { ids: this.notInIds, notIn: true };
            }
        }
    }
    /**
     * 返回一个条件
     * @param colName
     */
    toCdt(colName) {
        let result = this.getResult();
        if (result == null)
            return null;
        if (result.notIn) {
            return new NotCdt_1.default(new Cdt_1.default(colName, result.ids));
        }
        else {
            return new Cdt_1.default(colName, result);
        }
    }
}
exports.default = default_1;
