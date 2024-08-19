"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BeanUtil_1 = require("./../util/BeanUtil");
const ArrayUtil_1 = require("./../util/ArrayUtil");
const Query_1 = __importDefault(require("./../dao/query/Query"));
const BaseCdt_1 = __importDefault(require("./../dao/query/cdt/BaseCdt"));
/**
 * 用于同步数据，将level=brand 的数据同步到其他级别下
 */
class SyncData {
    constructor(opt) {
        this._opt = opt;
    }
    getLevel() {
        let level = this._opt.level;
        if (level == null)
            level = 'brand';
        return level;
    }
    noNeedSchLevel() {
        let noNeedSchLevel = this._opt.noNeedSchLevel;
        return noNeedSchLevel != null;
    }
    async buildQuery(list) {
        let query = new Query_1.default();
        let noCol = this.getNoCol();
        query.in(noCol, ArrayUtil_1.ArrayUtil.toArray(list, noCol));
        query.eq('is_del', 0);
        if (!this.noNeedSchLevel())
            query.notEq('level', this.getLevel());
        let otherCdt = this._opt.otherCdt;
        if (otherCdt) {
            query.addCdt(BaseCdt_1.default.parse(otherCdt));
        }
        return query;
    }
    async _find(list) {
        let dao = this.getDao();
        let query = await this.buildQuery(list);
        return await dao.find(query);
    }
    async syncData(list) {
        if (list == null || list.length == 0)
            return;
        let array = await this._find(list);
        if (array.length == 0)
            return;
        let dao = this.getDao();
        let self = this;
        let idCol = this.getIdCol();
        let datas = ArrayUtil_1.ArrayUtil.joinArray({
            key: this.getNoCol(),
            list,
            list2: array,
            fun(data, list2Array) {
                let retArray = [];
                let cols = self.getCols();
                for (let row of list2Array) {
                    if (!self.isSame(row, data)) {
                        let updateData = {};
                        for (let col of cols) {
                            updateData[col] = data[col];
                        }
                        updateData[idCol] = row[idCol];
                        retArray.push(updateData);
                    }
                }
                return retArray;
            }
        });
        await dao.updateArray(datas);
    }
    getTableName() {
        return this._opt.tableName;
    }
    getDao() {
        let context = this._opt.context;
        return context.get(this.getTableName() + 'dao');
    }
    getNoCol() {
        return this.getTableName() + '_no';
    }
    getIdCol() {
        return this.getTableName() + '_id';
    }
    isSame(data, data1) {
        return BeanUtil_1.BeanUtil.isEqual(data, data1, this.getCols());
    }
    getCols() {
        let opt = this._opt;
        let cols = opt.cols;
        if (cols == null)
            cols = ['sort', 'name', 'is_del'];
        return cols;
    }
}
exports.default = SyncData;
