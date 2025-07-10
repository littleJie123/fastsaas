"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class Searcher {
    constructor() {
        this._map = {};
    }
    /**
     * 传入的id中是否有0
     * @returns
     */
    hasZeroId() {
        return false;
    }
    setContext(context) {
        this._context = context;
    }
    getContext() {
        return this._context;
    }
    getIdKey() {
        //return this.getKey() + '_id';
        let dao = this.getDao();
        return dao.getPojoIdCol();
    }
    getDao() {
        return this._context.get(this.getKey() + 'Dao');
    }
    getNoKey() {
        return this.getKey() + '_no';
    }
    /**
     * 是否逻辑删除
     */
    getIsDel() {
        return false;
    }
    afterBuild(context) {
        let opt = {
            col: this.getIdKey()
        };
        // if(this.getIsDel()){
        //   opt.otherCdt = {
        //     isDel:0
        //   }
        // }
        this.reg('getById', new Inquiry_1.default(opt));
        this.init(context);
        var map = this._map;
        for (var e in map) {
            let inquiry = map[e];
            inquiry.setKey(this.getKey());
            inquiry.setContext(this._context);
        }
    }
    /**
     * 注册key
     * @param inquiryKey
     * @param inquiry
     */
    reg(inquiryKey, inquiry) {
        inquiry.setSchColsOnReg(this.getSchCols());
        this._map[inquiryKey] = inquiry;
    }
    getSchCols() {
        return null;
    }
    _getAll() {
        var array = [];
        for (var e in this._map) {
            var inquiry = this._map[e];
            if (inquiry) {
                array.push(inquiry);
            }
        }
        return array;
    }
    async save(key, array) {
        var inquiry = this.get(key);
        if (inquiry) {
            await inquiry.save(array);
        }
    }
    /**
     * 根据id保存到缓存中，以后get 和findByIds可以从缓存中读取数据
     * @param key
     * @param array
     */
    async saveByIds(array) {
        await this.save('getById', array);
    }
    get(key) {
        return this._map[key];
    }
    getCache(key) {
        let inquiry = this.get(key);
        return inquiry.acqCache();
    }
    async saveAll(array) {
        var list = this._getAll();
        for (var i = 0; i < list.length; i++) {
            if (list[i].couldSaveAll()) {
                await list[i].save(array);
            }
        }
        // list.forEach(obj=>obj.save(array));
    }
    /**
     * 清空缓存，对于多表查询可能无效
     */
    clearCache() {
        var list = this._getAll();
        for (var i = 0; i < list.length; i++) {
            list[i].clearCache();
        }
    }
    /**
     * 根据ids 列表查询多条记录
     * @param array
     */
    async findByIds(idArray, col) {
        var inquiry = this.get('getById');
        let array = idArray;
        let hasZero = false;
        if (this.hasZeroId()) {
            array = [];
            for (let id of idArray) {
                if (id != 0) {
                    array.push(id);
                }
                else {
                    hasZero = true;
                }
            }
        }
        let ret = await inquiry.find(array, col);
        if (this.hasZeroId()) {
            if (hasZero) {
                ret.push(this.buildWithZeroId());
            }
        }
        return ret;
    }
    async findAndCheck(idArray, schQuery, cols) {
        let pojos = await this.findByIds(idArray);
        let query = schQuery;
        if (schQuery != null && cols != null) {
            query = {};
            for (let col of cols) {
                query[col] = schQuery[col];
            }
        }
        if (query == null) {
            return pojos;
        }
        let dao = new fastsaas_1.ArrayDao(pojos);
        return await dao.find(query);
    }
    /**
     *
     * @param obj 带有主键的对象
     * @param cols  需要检查的字段
     * @returns
     */
    async getByObj(obj, cols) {
        if (obj == null) {
            return null;
        }
        let schObj;
        if (cols == null) {
            schObj = obj;
        }
        else {
            schObj = {};
            for (let col of cols) {
                schObj[col] = obj[col];
            }
        }
        let ret = await this.getById(obj[this.getIdKey()]);
        for (let e in schObj) {
            if (ret[e] != schObj[e]) {
                return null;
            }
        }
        return ret;
    }
    /**
     * 从缓存中拿
     * @param array
     * @param col
     */
    findByIdsFromCache(array, col) {
        var inquiry = this.get('getById');
        return inquiry.acqDataFromCache(array, col);
    }
    buildWithZeroId() {
        return null;
    }
    async getById(id) {
        if (id == null) {
            return null;
        }
        if (this.hasZeroId() && id == 0) {
            return this.buildWithZeroId();
        }
        var list = await this.findByIds([id]);
        return list[0];
    }
    /**
     * 从缓存中拿
     * @param array
     * @param col
     */
    getFromCache(id) {
        if (id == null)
            return null;
        var list = this.findByIdsFromCache(id);
        return list[0];
    }
}
exports.default = Searcher;
const Inquiry_1 = __importDefault(require("./inquiry/imp/Inquiry"));
const fastsaas_1 = require("../fastsaas");
