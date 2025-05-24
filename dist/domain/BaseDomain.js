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
     * 保存数组
     * @param obj
     */
    async saveDatasByParam(saveParams) {
        let dao = this.getDao();
        let pkCol = this.getPkCol();
        let needAdds = [];
        let needUpdates = [];
        let needDels = [];
        let bPks = this.getBussinessPks();
        let existing = null;
        existing = await this.findExistsDatasByParam(saveParams);
        if (bPks != null && bPks.length > 0) {
            let self = this;
            fastsaas_1.ArrayUtil.joinArray({
                list: saveParams.datas,
                list2: existing,
                key: bPks,
                fun(data, existingDatas) {
                    if (existingDatas.length > 1) {
                        existingDatas.sort(self.buildSortFun4CheckRepeat());
                    }
                    data[pkCol] = existingDatas[0][pkCol];
                },
            });
        }
        if (saveParams.needDel) {
            needDels = fastsaas_1.ArrayUtil.notInByKey(existing, saveParams.datas, pkCol);
        }
        for (let obj of saveParams.datas) {
            if (obj[pkCol]) {
                needUpdates.push(obj);
            }
            else {
                needAdds.push(obj);
            }
        }
        await dao.addArray(needAdds);
        if (saveParams.updateCols) {
            await dao.updateArrayWithCols(needUpdates, saveParams.updateCols);
        }
        else {
            await dao.updateArray(needUpdates);
        }
        await this.delDatas(needDels);
        if (saveParams.needCheck) {
            await this.checkDatas(saveParams);
        }
    }
    /**
     * 根据业务主键来查询是否有重复的数据
     * @param saveParams
     */
    async checkDatas(saveParams) {
        let bPks = this.getBussinessPks();
        if (bPks == null || bPks.length == 0) {
            return;
        }
        let existsDatas = await this.findExistsDatasByParam(saveParams);
        let needDels = [];
        let sortFun = this.buildSortFun4CheckRepeat();
        fastsaas_1.ArrayUtil.groupBy({
            array: existsDatas,
            key: bPks,
            fun(list) {
                if (list.length > 1) {
                    list.sort(sortFun);
                    for (let i = 1; i < list.length; i++) {
                        needDels.push(list[i]);
                    }
                }
            }
        });
        await this.delDatas(needDels);
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
    // protected async setIdToDatas(datas:Do[],exists?:Do[]){
    //   let bPks = this.getBussinessPks();
    //   if(bPks == null || bPks.length == 0){
    //     throw new Error('业务主键不能为空');
    //   }
    //   let pkCol = this.getPkCol();
    //   if(exists == null){
    //     let query = this.buildQueryByDatas(datas);
    //     exists = await this.getDao().find(query);
    //   }
    //   ArrayUtil.join({
    //     list:datas,
    //     list2:exists,
    //     key:bPks,
    //     fun(data:Do ,data2:Do ){
    //       data[pkCol] = data2[pkCol];
    //     }
    //   })
    // }
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
    buildSortFun4CheckRepeat() {
        let pkCol = this.getPkCol();
        return function (a, b) {
            return b[pkCol] - a[pkCol];
        };
    }
}
exports.default = BaseDomain;
