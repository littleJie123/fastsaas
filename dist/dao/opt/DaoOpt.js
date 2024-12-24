"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColChanger_1 = __importDefault(require("../colChanger/ColChanger"));
class DaoOpt {
    constructor(opt) {
        var _a;
        if (opt == null)
            opt = {};
        opt = { ...opt };
        if (opt.colChanger == null && opt.Pojo != null) {
            let Pojo = opt.Pojo;
            let dbToPojoMap = (_a = Pojo.prototype) === null || _a === void 0 ? void 0 : _a.__dbToPojoMap;
            if (dbToPojoMap)
                opt.colChanger = new ColChanger_1.default(dbToPojoMap, Pojo);
        }
        this._opt = opt;
    }
    clone() {
        return new DaoOpt({
            ...this._opt
        });
    }
    /**
     * 删除colchange
     * @returns
     */
    removeColChange() {
        this._opt.colChanger = null;
        return this;
    }
    /**
     * 将内存中的字段转成db的字段
     * @param pojoField  内存中的字段
     */
    parsePojoFieldsToDbFields(pojoField) {
        if (this._opt.colChanger == null) {
            return pojoField;
        }
        return this._opt.colChanger.parsePojoFieldsToDbFields(pojoField);
    }
    /**
     * 将一个内存的字段转成pos的字段
     * @param pojoField 内存的字段
     */
    parsePojoField(pojoField) {
        if (this._opt.colChanger == null) {
            return pojoField;
        }
        return this._opt.colChanger.parsePojoField(pojoField);
    }
    /**
     * 返回列的转换器
     * @returns
     */
    getColChanger() {
        return this._opt.colChanger;
    }
    /**
     * 返回表名
     */
    getTableName() {
        return this._opt.tableName;
    }
    /**
     * @returns poolName
     */
    getPoolName() {
        return this._opt.poolName;
    }
    getIds() {
        return this._opt.ids;
    }
    /**
     * 返回id列表
     */
    acqIds() {
        var opt = this._opt;
        if (opt.ids == null)
            return ['id'];
        var ids = opt.ids;
        if (!(ids instanceof Array))
            ids = [ids];
        return ids;
    }
    /**
     * 是否 id[可以兼容判断内存和db的字段]
     * @param col
     */
    isId(col) {
        var ids = this.acqIds();
        for (var id of ids) {
            if (col == id)
                return true;
            let colChanger = this._opt.colChanger;
            if (colChanger != null) {
                let dbField = colChanger.parsePojoField(col);
                if (dbField == id) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 是否自增
     */
    isIncrement() {
        var opt = this._opt;
        return opt.increment == null || opt.increment == true;
    }
    /**
     * 返回首个数据库id
     */
    acqFirstId() {
        var ids = this.acqIds();
        return ids[0];
    }
    /**
     * 返回首个内存中的pojo id
     */
    acqPojoFirstId() {
        return this.parseDbField(this.acqFirstId());
    }
    /**
     * 将db的字段变成pojo的字段
     * @param col
     */
    parseDbField(col) {
        if (this._opt.colChanger == null)
            return col;
        return this._opt.colChanger.parseDbField(col);
    }
}
exports.default = DaoOpt;
