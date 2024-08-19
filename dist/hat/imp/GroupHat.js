"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../util/ArrayUtil");
const Hat_1 = __importDefault(require("./Hat"));
const Query_1 = __importDefault(require("./../../dao/query/Query"));
/**
 * _acqGroup //group 字段
 * acqCol //返回的查询字段
 * async _acqOtherCdt // 返回的其他字段
 * 通过group查询的帽子
 */
class GroupHat extends Hat_1.default {
    constructor(opt) {
        super(opt);
    }
    async _schMap(list) {
        let dao = this.getDao();
        let query = await this._buildQuery(list);
        let array = await dao.find(query);
        return this._toMap(array);
    }
    _toMap(array) {
        if (array.length == 0)
            return {};
        return ArrayUtil_1.ArrayUtil.toMapByKey(array, this.acqDataCol());
    }
    _processData(data, hatData) {
        data.cnt = hatData.cnt;
    }
    /**
     * 返回列
     */
    acqCol() {
        return [this.acqDataCol(), 'count(*) as cnt'];
    }
    /**
     * 返回group字段
     */
    _acqGroup() {
        return [this.acqDataCol()];
    }
    async _buildQuery(list) {
        let query = new Query_1.default();
        query.in(this.acqDataCol(), this._acqIdsFromList(list));
        query.addCdt(await this._acqOtherCdt(list));
        query.col(this.acqCol());
        query.group(this._acqGroup());
        return query;
    }
    async _acqOtherCdt(list) {
        let opt = this._opt;
        if (opt.otherCdt) {
            return opt.otherCdt;
        }
    }
    _acqDefData(data) {
        return {
            [this.acqDataCol()]: data[this.acqDataCol()],
            cnt: 0
        };
    }
}
exports.default = GroupHat;
