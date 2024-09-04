"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseHat_1 = __importDefault(require("../BaseHat"));
const ArrayUtil_1 = require("./../../util/ArrayUtil");
/**
 * 跨表/接口 查询类
 * _filterList(list) //过滤条件
 * fun // 处理函数
 *
 *
 */
// dataXxxx 主表 hatXxx 从表字段
class Hat extends BaseHat_1.default {
    /**
     * 返回从数据中查询的字段名
     */
    acqHatCol(row) {
        var opt = this._opt;
        if (opt.hatCol) {
            return opt.hatCol;
        }
        if (row.name != null)
            return 'name';
        else
            return this.getKey() + 'Name';
    }
    /**
 * 返回给主表的名称
 */
    acqDataName() {
        var opt = this._opt;
        if (opt.dataName) {
            return opt.dataName;
        }
        var key = this.getKey();
        return key + 'Name';
    }
    /**
    返回读取data中的字段
    */
    acqDataCol() {
        var opt = this._opt;
        if (opt.dataCol != null) {
            return opt.dataCol;
        }
        var key = this.getKey();
        key = key + 'Id';
        return key;
    }
    _acqMapKey(data) {
        return data[this.acqDataCol()];
    }
    getKey() {
        return this._opt.key;
    }
    getDao(key) {
        if (key == null) {
            key = this.getKey();
        }
        return this.getContext().get(key + 'Dao');
    }
    getSearcher(key) {
        if (key == null) {
            key = this.getKey();
        }
        return this.getContext().get(key + 'searcher');
    }
    async process(list) {
        var map = await this._schMap(list);
        let prmses = [];
        for (var i = 0; i < list.length; i++) {
            prmses.push(this._process(list[i], map));
        }
        await Promise.all(prmses);
        return list;
    }
    async _schMap(list) {
        list = this._acqIdsFromList(list);
        if (list.length == 0)
            return {};
        var array = await this._findByIds(list);
        let map = this._toMap(array);
        return map;
    }
    _acqIdsFromList(list) {
        var key = this.acqDataCol();
        var funName = '_filterList';
        if (this[funName]) {
            list = this[funName](list);
        }
        list = ArrayUtil_1.ArrayUtil.toArray(list, key);
        list = ArrayUtil_1.ArrayUtil.distinct(list);
        return list;
    }
    /**
     * 将查询结果转成map ，方便取值
     * @param array
     */
    _toMap(array) {
        if (array.length == 0)
            return {};
        var row = array[0];
        if (row.id == null) {
            //数据没有id
            return ArrayUtil_1.ArrayUtil.toMapByKey(array, this.getKey() + 'Id');
        }
        else {
            return ArrayUtil_1.ArrayUtil.toMapByKey(array, 'id');
        }
    }
    /**
     * 根据主键从 关联表取数据
     * @param list
     */
    async _findByIds(list) {
        var searcher = this.getSearcher();
        var array = await searcher.findByIds(list);
        return array;
    }
    /**
     * 从map里面查询关联数据
     * @param data
     * @param map
     */
    async _acqHatData(data, map) {
        var mapKey = await this._acqMapKey(data);
        if (mapKey == null) {
            return null;
        }
        var hatData = map[mapKey];
        return hatData;
    }
    _acqDefData(data) {
        return null;
    }
    async _process(data, map) {
        let hatData = await this._acqHatData(data, map);
        if (hatData == null) {
            hatData = this._acqDefData(data);
        }
        if (hatData != null) {
            if (this._fun) {
                await this._fun(data, hatData);
            }
            else {
                await this._processData(data, hatData);
            }
        }
        return data;
    }
    _processData(data, hatData) {
        if (!this._opt.getObj) {
            data[this.acqDataName()] = hatData[this.acqHatCol(hatData)];
        }
        else {
            data[this._opt.key] = hatData;
        }
    }
}
exports.default = Hat;
