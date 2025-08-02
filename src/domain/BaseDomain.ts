import { ArrayUtil, Context, Dao, Query, Searcher } from "../fastsaas";
import IDomainOpt from "./inf/IDomainOpt";
import ISaveParam from "./inf/ISaveParam";
import UpdateOpt from "./inf/UpdateOpt";

export default abstract class BaseDomain<Do = any> {
  protected _context: Context;

  setContext(context: Context) {
    this._context = context;
  }
  getContext(): Context {
    return this._context;
  }


  getDao(): Dao<Do> {
    return null
  };

  getSearcher(): Searcher<Do> {
    return null;
  }


  /**
   * 返回业务主键
   */
  protected getBussinessPks(): string[] {
    return null;
  }





  protected getPkCol() {
    let dao = this.getDao();
    return dao.getPojoIdCol();
  }

  /**
   * 保存数组,根据业务主键来判断是否需要新增,更新,删除
   * @param obj
   */
  async saveDatasWithBPk(saveParams: ISaveParam<Do>) {
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
      async adds(datas: Do[]) {
        await self.addDatasByArray(datas);
      },
      async dels(datas: Do[]) {
        await self.delDatas(datas);
      },
    })
  }

  protected async addDatasByArray(datas: Do[]) {
    let dao = this.getDao();
    await dao.addArray(datas);
  }
  /**
   * 根据主键来更新数据
   * @param datas 
   * @param updateCols 
   */
  protected async saveDatasByArray(datas: Do[], updateCols?: string[]) {
    let pk = this.getPkCol();
    let needAdds: Do[] = [];
    let needUpdates: Do[] = [];
    let dao = this.getDao();
    for (let data of datas) {
      if (data[pk] == null) {
        needAdds.push(data);
      } else {
        needUpdates.push(data);
      }
    }
    await dao.addArray(needAdds);
    if (updateCols) {
      await dao.updateArrayWithCols(needUpdates, updateCols)
    } else {
      await dao.updateArray(needUpdates);
    }
  }






  protected async delDatas(datas: Do[]) {
    let dao = this.getDao();
    await dao.updateArrayWithCols(datas, [], {
      isDel: 1
    })
  }



  /**
   * 根据业务主键删除重复数据
   * @param query 
   */
  protected async delRepeatDatas(query: any): Promise<Do[]> {
    let list = await this.getDao().find(query);
    let bPks = this.getBussinessPks();
    if (bPks == null || bPks.length == 0) {
      throw new Error('业务主键不能为空');
    }
    let retList: Do[] = [];
    let needDel: Do[] = [];
    let pkCol = this.getPkCol();
    ArrayUtil.groupBy({
      list: list,
      key: bPks,
      fun(list: Do[]) {
        list.sort((a, b) => {
          return a[pkCol] - b[pkCol];
        })
        retList.push(list[0]);
        for (let i = 1; i < list.length; i++) {
          needDel.push(list[i]);
        }
      }
    })
    await this.delDatas(needDel);
    return retList;
  }

  /**
   * 通过业务主键查询数据
   * @param datas 
   */
  protected async schPk4Array(datas: Do[]) {
    let exists = await this.schByBPks(datas);
    this.setPks(datas, exists);
  }

  /**
   * 将数据库中的数据主键设置到datas中
   * @param datas 内存数据
   * @param dbDatas 数据库数据
   */
  protected setPks(datas: Do[], dbDatas: Do[]) {
    let pkCol = this.getPkCol();
    ArrayUtil.joinArray({
      list: dbDatas,
      list2: datas,
      key: this.getBussinessPks(),
      fun(exists: Do, datasArray: Do[]) {
        for (let data of datasArray) {
          data[pkCol] = exists[pkCol];
        }
      }
    })
  }

  protected async schByBPks(datas: Do[]): Promise<Do[]> {
    let query = new Query();
    query.eq('isDel', 0);
    let bPks = this.getBussinessPks()
    if (bPks == null || bPks.length == 0) {
      throw new Error('业务主键不能为空');
    }
    query.inObjs(bPks, datas);
    return this.getDao().find(query);
  }

  /**
   * 加载数据
   * @param datas 
   * @param opt 
   * @returns 
   */
  async load(datas: Do[], opt?: IDomainOpt<Do>): Promise<Do[]> {
    let searcher = this.getSearcher();
    let pkCol = this.getPkCol()
    let dbDatas = await searcher.findAndCheck(
      ArrayUtil.toArray(datas, pkCol),
      opt?.schQuery
    )
    if (opt.onBeforeLoad) {
      await opt.onBeforeLoad(dbDatas);
    }
    function copy(src, target) {
      if (opt?.cols) {
        for (let col of opt.cols) {
          if (target[col] == null) {
            target[col] = src[col]
          }
        }
      } else {
        for (let col in src) {
          if (target[col] == null) {
            if (src.hasOwnProperty(col)) {
              target[col] = src[col]
            }
          }
        }
      }
    }
    let retList = ArrayUtil.join({
      list: dbDatas,
      list2: datas,
      fun(dbData, newData) {
        if (opt?.onCompare) {
          opt?.onCompare(dbData, newData)
        }
        copy(dbData, newData)
        return newData
      },
      key: pkCol
    })

    await this.loadOtherTable(retList, opt)
    return retList;

  }

  private async loadOtherTable(list: Do[], opt?: IDomainOpt<Do>) {
    let loadKeys = opt.loadKeys;
    if (loadKeys != null && loadKeys.length > 0) {
      for (let loadKey of loadKeys) {
        let searcher: Searcher = this.getSearcherByKey(loadKey);
        await searcher.findByIds(ArrayUtil.toArrayDis(list, this.getIdColByKey(loadKey)));

      }
      for (let row of list) {
        for (let loadKey of loadKeys) {
          let searcher: Searcher = this.getSearcherByKey(loadKey);
          let idCol = this.getIdColByKey(loadKey);
          if (row[idCol] != null) {
            row[loadKey] = await searcher.getById(row[idCol]);
          }
        }
      }
    }
  }

  private getSearcherByKey(key: string): Searcher {
    return this._context.get(key + 'Searcher');
  }

  private getIdColByKey(key: string) {
    return key + 'Id';
  }



  protected async updateWithContext(opt: UpdateOpt<Do>): Promise<Do[]> {
    let dao = this.getDao();
    let cnt = 0;
    if (opt.datas == null || opt.datas.length == 0) {
      return [];
    }
    if (opt.cols == null) {
      cnt = await dao.updateArray(opt.datas, opt.other, opt.whereObj)
    } else {
      cnt = await dao.updateArrayWithCols(opt.datas, opt.cols, opt.other, opt.whereObj)
    }
    if (cnt == opt.datas.length) {
      return opt.datas
    }
    if (cnt == 0) {
      return [];
    }
    let query = new Query(opt.whereObj);
    query.eq('contextId', this._context.getId())
    return await dao.find(query);

  }

  protected onlyCols(datas: Do[], cols: string[]): Do[] {
    let pkCol = this.getPkCol()
    return datas.map((data: Do) => {
      let ret: any = {}
      ret[pkCol] = data[pkCol];
      for (let col of cols) {
        ret[col] = data[col]
      }
      return ret;
    })
  }
}