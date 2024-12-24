"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class Mapper {
    constructor(datas, keys) {
        this.mapper = {};
        this.init(datas, this.mapper, keys, 0);
    }
    init(datas, map, keys, index) {
        let self = this;
        let key = keys[index];
        fastsaas_1.ArrayUtil.groupBy({
            list: datas,
            key: key,
            fun(array, e) {
                if (index >= keys.length - 1) {
                    map[e] = array;
                }
                else {
                    map[e] = {};
                    self.init(array, map[e], keys, index + 1);
                }
            }
        });
    }
    get(keys) {
        let map = this.mapper;
        for (let i = 0; i < keys.length; i++) {
            if (i == keys.length - 1) {
                return map[keys[i]];
            }
            else {
                map = map[keys[i]];
            }
        }
    }
}
exports.default = Mapper;
