"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class Searcher {
    constructor() {
        this._map = {};
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
        if (this.getIsDel()) {
            opt.otherCdt = {
                isDel: 0
            };
        }
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
    async findByIds(array, col) {
        var inquiry = this.get('getById');
        return await inquiry.find(array, col);
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
    async getById(id) {
        if (id == null)
            return null;
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
