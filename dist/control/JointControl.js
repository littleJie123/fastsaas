"use strict";
/**
 * 联合表的查询条件
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListControl_1 = __importDefault(require("./ListControl"));
const ArrayUtil_1 = require("./../util/ArrayUtil");
const JointFun_1 = __importDefault(require("./wiget/imp/JointFun"));
const JointTable_1 = __importDefault(require("./wiget/imp/JointTable"));
class default_1 extends ListControl_1.default {
    async buildQuery() {
        let query = await super.buildQuery();
        let map = {};
        let jws = this.getJointWiget();
        await ArrayUtil_1.ArrayUtil.groupBySync({
            array: jws,
            key: jw => jw.getCol(),
            async fun(array, col) {
                let ret = null;
                for (let jw of array) {
                    ret = await jw.addData(ret);
                }
                map[col] = ret;
            }
        });
        for (let e in map) {
            if (map[e] != null) {
                query.in(e, map[e]);
            }
        }
        return query;
    }
    async addCdt(query) {
        var param = this._param;
        for (var e in param) {
            let val = param[e];
            let jointWigets = this.getJointWiget();
            let inJoint = false;
            for (let jw of jointWigets) {
                if (jw.isIncludeKey(e)) {
                    await jw.addParam(e, val, () => this.buildCdt(e, val));
                    inJoint = true;
                }
            }
            if (!inJoint)
                query.addCdt(await this.buildCdt(e, param[e]));
        }
    }
    /**
     * 返回 联合查询的组件
     * @returns
     */
    getJointWiget() {
        if (this.jointWigets == null) {
            this.jointWigets = [];
            for (let jo of this.getJointOpt()) {
                let jw;
                if (jo.table == null) {
                    jw = new JointFun_1.default();
                }
                else {
                    jw = new JointTable_1.default();
                }
                jw.setContext(this.getContext());
                jw.setOpt(jo);
                this.jointWigets.push(jw);
            }
        }
        return this.jointWigets;
    }
}
exports.default = default_1;
