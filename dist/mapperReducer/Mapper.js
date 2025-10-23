"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
/**
 * 一个多级的缓存
 */
class Mapper {
    constructor(datas, keyGeters) {
        this.mapper = {};
        if (datas != null) {
            if (keyGeters == null) {
                throw new Error('mapper没有设置keys，无法初始化');
            }
            this.init(datas, this.mapper, keyGeters, 0);
            this.keysLen = keyGeters.length;
        }
    }
    /**
     * 设置数据,会进行分组
     * @param keyGeters
     * @param datas
     */
    setByGeters(keyGeters, datas) {
        if (this.keysLen != null) {
            if (keyGeters.length != this.keysLen) {
                throw new Error('mapper的keys长度不一致，无法保存');
            }
        }
        this.init(datas, this.mapper, keyGeters, 0);
    }
    add(keys, datas) {
        if (this.keysLen != null) {
            if (this.keysLen != keys.length) {
                throw new Error('mapper的keys长度不一致，无法保存');
            }
        }
        let map = this.mapper;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (i == keys.length - 1) {
                if (map[key] == null) {
                    map[key] = [];
                }
                map[key].push(...datas);
            }
            else {
                if (map[key] == null) {
                    map[key] = {};
                }
                map = map[key];
            }
        }
    }
    init(datas, map, keys, index) {
        let self = this;
        let key = keys[index];
        fastsaas_1.ArrayUtil.groupBy({
            list: datas,
            key: key,
            fun(array, e) {
                if (index >= keys.length - 1) {
                    if (map[e] == null) {
                        map[e] = array;
                    }
                    else {
                        map[e].push(...array);
                    }
                }
                else {
                    if (map[e] == null) {
                        map[e] = {};
                    }
                    self.init(array, map[e], keys, index + 1);
                }
            }
        });
    }
    /**
     * 根据keys查询出内存的值
     * @param keys
     * @returns
     */
    get(keys) {
        let map = this.mapper;
        for (let i = 0; i < keys.length; i++) {
            if (i == keys.length - 1) {
                return this.getArrayFromMap(map[keys[i]]);
            }
            else {
                map = map[keys[i]];
                if (map == null) {
                    return [];
                }
            }
        }
    }
    getArrayFromMap(mapArray) {
        if (mapArray == null) {
            return [];
        }
        if (mapArray instanceof Array) {
            return mapArray;
        }
        let ret = [];
        this.doGetArrayFromMap(mapArray, ret);
        return ret;
    }
    doGetArrayFromMap(mapArray, ret) {
        for (let e in mapArray) {
            let datas = mapArray[e];
            if (datas instanceof Array) {
                ret.push(...datas);
            }
            else {
                this.doGetArrayFromMap(datas, ret);
            }
        }
    }
}
exports.default = Mapper;
