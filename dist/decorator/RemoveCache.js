"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ArrayUtil_1 = require("./../util/ArrayUtil");
const BeanUtil_1 = require("./../util/BeanUtil");
function default_1(opt) {
    return function classDecorator(constructor) {
        return class extends constructor {
            _getSearcher() {
                if (this._searcher == null) {
                    let self = this; //只是保证编译不出错
                    let context = self.getContext();
                    let tablename = self.getTableName();
                    this._searcher = context.get(tablename + 'searcher');
                }
                return this._searcher;
            }
            async clearCache(obj) {
                if (obj == null)
                    return;
                let array = null;
                if (obj instanceof Array) {
                    array = obj;
                }
                else {
                    array = [obj];
                }
                for (let cacheName of opt.cacheNames) {
                    await this._clearCache(cacheName, array);
                }
            }
            async _clearCache(cacheName, array) {
                let searcher = this._getSearcher();
                let inquiry = searcher.get(cacheName);
                if (inquiry != null) {
                    await inquiry.removeCache(array);
                }
            }
            async add(obj) {
                let ret = await super['add'](obj);
                await this.clearCache(obj);
                return ret;
            }
            async del(obj, opts) {
                let datas = await this._buildDelDataForClear(obj);
                let ret = await super['del'](obj, opts);
                await this.clearCache(datas);
                return ret;
            }
            async delArray(array, opts) {
                let datas = await this._buildDelDataForClear(array);
                let ret = await super['delArray'](array, opts);
                await this.clearCache(datas);
                return ret;
            }
            async addArray(array) {
                let ret = await super['addArray'](array);
                await this.clearCache(array);
                return ret;
            }
            async _buildUpdateDataForClear(obj) {
                let array;
                if (obj instanceof Array) {
                    array = obj;
                }
                else {
                    array = [obj];
                }
                let self = this;
                let pkCol = self._opt.acqFirstId();
                let pks = ArrayUtil_1.ArrayUtil.toArray(array, pkCol);
                let searcher = this._getSearcher();
                let datas = await searcher.findByIds(pks);
                let updateDataMap = ArrayUtil_1.ArrayUtil.toMapByKey(array, pkCol);
                let retArray = [];
                retArray.push(...datas);
                for (let data of datas) {
                    let pk = data[pkCol];
                    let updateData = updateDataMap[pk];
                    if (updateData) {
                        let row = BeanUtil_1.BeanUtil.shallowCombine(updateData, data);
                        retArray.push(row);
                    }
                }
                return retArray;
            }
            async _buildDelDataForClear(obj) {
                let datas;
                if (obj instanceof Array) {
                    datas = obj;
                }
                else {
                    datas = [obj];
                }
                let self = this;
                let retArray = [];
                let needFind = [];
                let searcher = this._getSearcher();
                for (let data of datas) {
                    let dataOk = true;
                    for (let cacheName of opt.cacheNames) {
                        let quiry = searcher.get(cacheName);
                        if (quiry != null) {
                            let dataKey = quiry.acqDataCode(data);
                            if (dataKey == null) {
                                dataOk = false;
                                break;
                            }
                        }
                    }
                    if (dataOk) {
                        retArray.push(data);
                    }
                    else {
                        needFind.push(data);
                    }
                }
                let pkCol = self._opt.acqFirstId();
                let pks = ArrayUtil_1.ArrayUtil.toArray(needFind, pkCol);
                let findDatas = await searcher.findByIds(pks);
                return [...retArray, ...findDatas];
            }
            async update(obj, whereObj) {
                let self = this;
                let datas = await this._buildUpdateDataForClear(obj);
                let ret = await super['update'](obj, whereObj);
                await this.clearCache(datas);
                return ret;
            }
            async updateArray(datas, other, whereObj) {
                let self = this;
                let array = await this._buildUpdateDataForClear(datas);
                let ret = await super['updateArray'](datas, other, whereObj);
                await this.clearCache(array);
                return ret;
            }
        };
    };
}
