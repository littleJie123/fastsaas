"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dao_1 = __importDefault(require("../Dao"));
const Query_1 = __importDefault(require("../query/Query"));
const ArrayUtil_1 = require("./../../util/ArrayUtil");
const BeanUtil_1 = require("./../../util/BeanUtil");
const BaseCdt_1 = __importDefault(require("./../query/cdt/BaseCdt"));
class ArrayDao extends Dao_1.default {
    _initMap() {
        throw new Error("Method not implemented.");
    }
    _acqExecutor() {
        throw new Error("Method not implemented.");
    }
    constructor(param) {
        let opt = param;
        let array;
        if (opt instanceof Array) {
            opt = { array: opt };
        }
        if (opt.ids == null && opt.tableName != null) {
            opt.ids = [opt.tableName + '_id'];
        }
        array = opt.array;
        if (array == null) {
            array = [];
        }
        super(opt);
        if (array != null) {
            let pk = this.acqFirstId();
            if (pk != null) {
                for (let i = 0; i < array.length; i++) {
                    let row = array[i];
                    if (row[pk] == null) {
                        row[pk] = i + 1;
                    }
                }
                array.sort((row1, row2) => {
                    let id1 = row1[pk];
                    let id2 = row2[pk];
                    return id1 - id2;
                });
            }
        }
        this.array = array;
    }
    acqFirstId() {
        let opt = this._opt;
        let ids = opt.getIds();
        if (ids != null)
            return ids[0];
        if (opt.getTableName() != null) {
            return opt.getTableName() + '_id';
        }
        return null;
    }
    async add(obj) {
        if (this.acqFirstId() != null) {
            let maxId = this.findMaxId();
            if (maxId == null)
                maxId = 1;
            else
                maxId++;
            obj[this.acqFirstId()] = maxId;
            this.array.push(obj);
        }
        return obj;
    }
    async update(obj, whereObj) {
        if (obj == null || this.acqFirstId() == null)
            return 0;
        let row = this.getById(obj[this.acqFirstId()]);
        if (row == null)
            return 0;
        if (whereObj != null) {
            let query = new Query_1.default();
            query.addCdt(BaseCdt_1.default.parse(whereObj));
            if (!query.isHit(obj)) {
                return 0;
            }
        }
        BeanUtil_1.BeanUtil.copy(obj, row);
    }
    async getById(id) {
        for (let row of this.array) {
        }
    }
    findMaxId() {
        if (this.array == null || this.array.length == 0) {
            return null;
        }
        else {
            return this.array[this.array.length - 1][this.acqFirstId()];
        }
    }
    async find(opt) {
        let query = Query_1.default.parse(opt);
        let list = this._processFilter(query, this.array);
        let group = query.getGroups();
        if (!(group == null || group.length == 0)) {
            list = this._processGroup(query, list);
        }
        else {
            list = this._processCol(query, list);
        }
        return list;
    }
    _processCol(query, list) {
        let cols = query.acqCol();
        if (cols == null || cols.length == 0)
            return list;
        let retList = [];
        if (query.colhasAgg()) {
            let ret = {};
            for (let queryCol of cols) {
                let col = queryCol.clone();
                ret[col.getName()] = col.calList(list);
            }
            retList.push(ret);
        }
        else {
            for (let data of list) {
                let ret = {};
                for (let col of cols) {
                    ret[col.getName()] = col.toValue(data);
                }
                retList.push(ret);
            }
        }
        return retList;
    }
    _processFilter(query, list) {
        return query.hitList(list);
    }
    _processGroup(query, list) {
        let cols = query.acqCol();
        let group = query.getGroups();
        let retList = ArrayUtil_1.ArrayUtil.groupBy({
            list,
            key: group,
            fun(datas, e) {
                let ret = {};
                for (let queryCol of cols) {
                    let col = queryCol.clone();
                    ret[col.getName()] = col.calList(datas);
                }
                return ret;
            }
        });
        return this._processHaving(query, retList);
    }
    _processHaving(query, list) {
        let having = query.getHaving();
        if (having == null || having.length == 0)
            return list;
        let havingQuery = new Query_1.default();
        let cdts = query.getHaving();
        for (let cdt of cdts) {
            havingQuery.addCdt(cdt);
        }
        return havingQuery.hitList(list);
    }
}
exports.default = ArrayDao;
