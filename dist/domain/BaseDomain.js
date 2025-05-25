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
