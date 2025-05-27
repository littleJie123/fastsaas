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
    /**
     * 查询已经有的数据
     * @param saveParams
     * @returns
     */
    findExistsDatasByParam(saveParams) {
        let dao = this.getDao();
        let query = saveParams.query;
        if (query == null) {
            query = this.buildQueryByDatas(saveParams.datas);
        }
        return dao.find(query);
    }
    buildQueryByDatas(datas) {
        let bPks = this.getBussinessPks();
        let query = { isDel: 0 };
        for (let bPk of bPks) {
            query[bPk] = fastsaas_1.ArrayUtil.toArrayDis(datas, bPk);
        }
        return query;
    }
    async delDatas(datas) {
        let dao = this.getDao();
        await dao.updateArrayWithCols(datas, [], {
            isDel: 1
        });
    }
}
exports.default = BaseDomain;
