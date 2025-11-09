"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
class BaseDomain {
    setContext(context) {
        this._context = context;
    }
    getContext() {
        return this._context;
    }
    getDao() {
        return null;
    }
    ;
    getSearcher() {
        return null;
    }
    /**
     * 返回业务主键
     */
    getBussinessPks() {
        return null;
    }
    getPkCol() {
        let dao = this.getDao();
        return dao.getPojoIdCol();
    }
    /**
     * 保存数组,根据业务主键来判断是否需要新增,更新,删除
     * @param obj
     */
    async saveDatasWithBPk(saveParams) {
        if (saveParams.query == null) {
            throw new Error('查询条件不能为空');
        }
        let dao = this.getDao();
        let self = this;
        return await dao.onlyArray({
            array: saveParams.datas,
            mapFun: this.getBussinessPks(),
            query: saveParams.query,
            needUpdate: saveParams.needUpdate,
            needDel: saveParams.needDel,
            noSch: saveParams.noSch,
            async adds(datas) {
                await self.addDatasByArray(datas);
            },
            async dels(datas) {
                await self.delDatas(datas);
            },
        });
    }
    /**
     *
     * @param data
     */
    async saveDoByBPK(data) {
        let bpk = this.getBussinessPks();
        if (bpk == null || bpk.length == 0) {
            throw new Error('没有设置业务主键');
        }
        let query = {};
        for (let pk of bpk) {
            query[pk] = data[pk];
        }
        let list = await this.saveDatasWithBPk({
            datas: [data],
            needUpdate: true,
            query
        });
        return list[0];
    }
    async getDoByBPK(data) {
        let bpk = this.getBussinessPks();
        if (bpk == null || bpk.length == 0) {
            throw new Error('没有设置业务主键');
        }
        let query = { isDel: 0 };
        for (let pk of bpk) {
            query[pk] = data[pk];
        }
        return this.getDao().findOne(query);
    }
    async addDatasByArray(datas) {
        let dao = this.getDao();
        await dao.addArray(datas);
    }
    /**
     * 根据主键来更新数据
     * @param datas
     * @param updateCols
     */
    async saveDatasByArray(datas, updateCols) {
        let pk = this.getPkCol();
        let needAdds = [];
        let needUpdates = [];
        let dao = this.getDao();
        for (let data of datas) {
            if (data[pk] == null) {
                needAdds.push(data);
            }
            else {
                needUpdates.push(data);
            }
        }
        await dao.addArray(needAdds);
        if (updateCols) {
            await dao.updateArrayWithCols(needUpdates, updateCols);
        }
        else {
            await dao.updateArray(needUpdates);
        }
    }
    async delDatas(datas) {
        let dao = this.getDao();
        await dao.updateArrayWithCols(datas, [], {
            isDel: 1
        });
    }
    /**
     * 根据业务主键删除重复数据
     * @param query
     */
    async delRepeatDatas(query) {
        let list = await this.getDao().find(query);
        let bPks = this.getBussinessPks();
        if (bPks == null || bPks.length == 0) {
            throw new Error('业务主键不能为空');
        }
        let retList = [];
        let needDel = [];
        let pkCol = this.getPkCol();
        fastsaas_1.ArrayUtil.groupBy({
            list: list,
            key: bPks,
            fun(list) {
                list.sort((a, b) => {
                    return a[pkCol] - b[pkCol];
                });
                retList.push(list[0]);
                for (let i = 1; i < list.length; i++) {
                    needDel.push(list[i]);
                }
            }
        });
        await this.delDatas(needDel);
        return retList;
    }
    /**
     * 通过业务主键查询数据
     * @param datas
     */
    async schPk4Array(datas) {
        let exists = await this.schByBPks(datas);
        this.setPks(datas, exists);
    }
    /**
     * 将数据库中的数据主键设置到datas中
     * @param datas 内存数据
     * @param dbDatas 数据库数据
     */
    setPks(datas, dbDatas) {
        let pkCol = this.getPkCol();
        fastsaas_1.ArrayUtil.joinArray({
            list: dbDatas,
            list2: datas,
            key: this.getBussinessPks(),
            fun(exists, datasArray) {
                for (let data of datasArray) {
                    data[pkCol] = exists[pkCol];
                }
            }
        });
    }
    async schByBPks(datas) {
        let query = new fastsaas_1.Query();
        query.eq('isDel', 0);
        let bPks = this.getBussinessPks();
        if (bPks == null || bPks.length == 0) {
            throw new Error('业务主键不能为空');
        }
        query.inObjs(bPks, datas);
        return this.getDao().find(query);
    }
    /**
     * 加载数据
     * 会将数据库的数据设置到datas的对应属性里面，如果datas已经设置了数据，则不会被复制
     * @param datas
     * @param opt
     * @returns
     */
    async load(datas, opt) {
        let searcher = this.getSearcher();
        let pkCol = this.getPkCol();
        let dbDatas = await searcher.findAndCheck(fastsaas_1.ArrayUtil.toArray(datas, pkCol), opt === null || opt === void 0 ? void 0 : opt.schQuery);
        if (opt === null || opt === void 0 ? void 0 : opt.onBeforeLoad) {
            await opt.onBeforeLoad(dbDatas);
        }
        function copy(src, target) {
            if (opt === null || opt === void 0 ? void 0 : opt.cols) {
                for (let col of opt.cols) {
                    if (target[col] == null) {
                        target[col] = src[col];
                    }
                }
            }
            else {
                for (let col in src) {
                    if (target[col] == null) {
                        if (src.hasOwnProperty(col)) {
                            target[col] = src[col];
                        }
                    }
                }
            }
        }
        let retList = fastsaas_1.ArrayUtil.join({
            list: dbDatas,
            list2: datas,
            fun(dbData, newData) {
                if (opt === null || opt === void 0 ? void 0 : opt.onCompare) {
                    opt === null || opt === void 0 ? void 0 : opt.onCompare(dbData, newData);
                }
                copy(dbData, newData);
                return newData;
            },
            key: pkCol
        });
        await this.loadOtherTable(retList, opt);
        return retList;
    }
    /**
     * 查询其他表 根据opt的 **loadKeys** 进行加载,loadKeys保存的是表名
     * @param list
     * @param opt
     */
    async loadOtherTable(list, opt) {
        var _a, _b, _c, _d, _e, _f;
        if (list == null || list.length == 0) {
            return;
        }
        let loadKeys = opt === null || opt === void 0 ? void 0 : opt.loadKeys;
        if (loadKeys != null && loadKeys.length > 0) {
            for (let loadKey of loadKeys) {
                let table = (_c = (_b = (_a = opt === null || opt === void 0 ? void 0 : opt.loadOpt) === null || _a === void 0 ? void 0 : _a.tables) === null || _b === void 0 ? void 0 : _b[loadKey]) !== null && _c !== void 0 ? _c : loadKey;
                let searcher = this.getSearcherByKey(table);
                await searcher.findByIds(fastsaas_1.ArrayUtil.toArrayDis(list, this.getIdColByKey(loadKey)));
            }
            for (let row of list) {
                for (let loadKey of loadKeys) {
                    let table = (_f = (_e = (_d = opt === null || opt === void 0 ? void 0 : opt.loadOpt) === null || _d === void 0 ? void 0 : _d.tables) === null || _e === void 0 ? void 0 : _e[loadKey]) !== null && _f !== void 0 ? _f : loadKey;
                    let searcher = this.getSearcherByKey(table);
                    let idCol = this.getIdColByKey(loadKey);
                    if (row[idCol] != null) {
                        row[loadKey] = await searcher.getById(row[idCol]);
                    }
                }
            }
        }
    }
    /**
     * 查询其他表 根据opt的 **loadKeys** 进行加载,loadKeys保存的是表名
     * @param list
     * @param opt
     */
    async loadOtherTableToArray(list, opt) {
        if (list == null || list.length == 0) {
            return;
        }
        if (opt.table == null) {
            throw new Error('请提供主表信息');
        }
        let loadKeys = opt === null || opt === void 0 ? void 0 : opt.loadKeys;
        if (loadKeys != null && loadKeys.length > 0) {
            for (let loadKey of loadKeys) {
                let pkCol = this.getIdColByKey(opt.table);
                let dao = this.getDaoByKey(loadKey);
                let array = await dao.find({
                    [pkCol]: fastsaas_1.ArrayUtil.toArrayDis(list, pkCol)
                });
                if (array.length > 0) {
                    fastsaas_1.ArrayUtil.joinArray({
                        list,
                        list2: array,
                        key: pkCol,
                        fun(mainData, otherTableDatas) {
                            mainData[loadKey + 's'] = otherTableDatas;
                        }
                    });
                }
            }
        }
    }
    getSearcherByKey(key) {
        return this._context.get(key + 'Searcher');
    }
    getDaoByKey(key) {
        return this._context.get(key + 'Dao');
    }
    getIdColByKey(key) {
        return key + 'Id';
    }
    async updateWithContext(opt) {
        let dao = this.getDao();
        let cnt = 0;
        if (opt.datas == null || opt.datas.length == 0) {
            return [];
        }
        if (opt.cols == null) {
            cnt = await dao.updateArray(opt.datas, opt.other, opt.whereObj);
        }
        else {
            cnt = await dao.updateArrayWithCols(opt.datas, opt.cols, opt.other, opt.whereObj);
        }
        if (cnt == opt.datas.length) {
            return opt.datas;
        }
        if (cnt == 0) {
            return [];
        }
        let query = new fastsaas_1.Query(opt.whereObj);
        query.eq('contextId', this._context.getId());
        return await dao.find(query);
    }
    onlyCols(datas, cols) {
        let pkCol = this.getPkCol();
        return datas.map((data) => {
            let ret = {};
            ret[pkCol] = data[pkCol];
            for (let col of cols) {
                ret[col] = data[col];
            }
            return ret;
        });
    }
}
exports.default = BaseDomain;
