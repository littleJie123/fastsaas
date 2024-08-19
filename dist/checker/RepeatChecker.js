"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 重复检查
 */
const Query_1 = __importDefault(require("./../dao/query/Query"));
const BaseCdt_1 = __importDefault(require("./../dao/query/cdt/BaseCdt"));
const ColChecker_1 = __importDefault(require("./ColChecker"));
class RepeatChecker extends ColChecker_1.default {
    constructor(opt) {
        super(opt);
        this._opt = opt;
    }
    _initOpt(opt) {
        if (opt.col == null)
            opt.col = 'name';
        return opt;
    }
    _createMsg() {
        return null;
    }
    async _createError(param, col) {
        let opt = this._opt;
        let context = this.getContext();
        return new Error(opt.code);
    }
    getContext() {
        return this._opt.context;
    }
    async check(param) {
        let opt = this._opt;
        if (!opt.isArray) {
            await super.check(param);
        }
        else {
            let array = param.array;
            if (array == null || array.length == 0) {
                return;
            }
            let map = ArrayUtil_1.ArrayUtil.toMapArray(array, this.getCol());
            for (let e in map) {
                if (map[e].length > 1) {
                    throw await this._createError(map[e][0], this.getCol());
                }
            }
            await this.checkAdd(param);
            await this.checkUpdate(param);
        }
    }
    async checkUpdate(param) {
        let array = param.array;
        let col = this.getCol();
        if (array != null)
            array = ArrayUtil_1.ArrayUtil.filter(array, (data) => {
                return data[this.getIdCol()] != null && data[col] != null;
            });
        if (array.length == 0)
            return;
        let names = ArrayUtil_1.ArrayUtil.toArray(array, this.getCol());
        let query = new Query_1.default().in(this.getCol(), names);
        query.addCdt(BaseCdt_1.default.parse(this._opt.otherCdt));
        let dao = this.getDao();
        let list = await dao.find(query);
        let datas = ArrayUtil_1.ArrayUtil.notInByKey(list, array, this.getIdCol());
        if (datas.length > 0) {
            throw await this._createError(datas[0], this.getCol());
        }
    }
    getIdCol() {
        return this._opt.key + 'Id';
    }
    async checkAdd(param) {
        let array = param.array;
        if (array != null)
            array = ArrayUtil_1.ArrayUtil.filter(array, (data) => !data[this.getIdCol()]);
        if (array.length == 0)
            return;
        let names = ArrayUtil_1.ArrayUtil.toArray(array, this.getCol());
        names = ArrayUtil_1.ArrayUtil.filter(names, (row) => row != '');
        let query = new Query_1.default().in(this.getCol(), names);
        query.addCdt(BaseCdt_1.default.parse(this._opt.otherCdt));
        let dao = this.getDao();
        let list = await dao.find(query);
        if (list.length > 0) {
            throw await this._createError(list[0], this.getCol());
        }
    }
    getDao() {
        let opt = this._opt;
        let context = this.getContext();
        let dao = context.get(opt.key + 'dao');
        return dao;
    }
    async _check(value, col, param) {
        if (col != this.getCol())
            return true;
        let dao = this.getDao();
        let query = this._buildQuery(value, col, param);
        return await dao.findOne(query) == null;
    }
    _buildQuery(value, col, param) {
        let opt = this._opt;
        let query = new Query_1.default({
            [col]: value
        });
        let otherCdt = opt.otherCdt;
        query.addCdt(BaseCdt_1.default.parse(otherCdt));
        let dao = this.getDao();
        let idCol = dao.getPojoIdCol();
        let id = param[idCol];
        if (id != null) {
            query.notEq(idCol, id);
        }
        return query;
    }
    getCol() {
        let opt = this._opt;
        if (opt.col == null)
            return 'name';
        return opt.col;
    }
}
exports.default = RepeatChecker;
const ArrayUtil_1 = require("./../util/ArrayUtil");
