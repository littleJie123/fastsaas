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
        await dao.onlyArray({
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
}
exports.default = BaseDomain;
