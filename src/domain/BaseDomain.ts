import { ArrayUtil, Context, Dao } from "../fastsaas";
import ISaveParam from "./inf/ISaveParam";

export default abstract class BaseDomain<Do = any>{
  protected _context:Context;
 
  setContext(context:Context){
    this._context = context;
  }
  getContext():Context{
    return this._context;
  }


  getDao():Dao<Do>{
    return null
  };


  /**
   * 返回业务主键
   */
  protected getBussinessPks():string[]{
    return null;
  }

  protected getPkCol(){
    let dao = this.getDao();
    return dao.getPojoIdCol();
  }

  /**
   * 保存数组,根据业务主键来判断是否需要新增,更新,删除
   * @param obj
   */
  async saveDatasWithBPk(saveParams:ISaveParam<Do>){
    if(saveParams.query == null){
      throw new Error('查询条件不能为空');
    }
    let dao = this.getDao();
    let self = this;
    await dao.onlyArray({
      array:saveParams.datas,
      mapFun:this.getBussinessPks(),
      query:saveParams.query,
      needUpdate:saveParams.needUpdate,
      needDel:saveParams.needDel,
      async  adds(datas:Do[]){
        await self.addDatasByArray(datas);
      },
      async dels(datas:Do[]){
        await self.delDatas(datas);
      },
    })
  }

  protected async addDatasByArray(datas:Do[]){
    let dao = this.getDao();
    await dao.addArray(datas);
  }
  /**
   * 根据业务主键来查询是否有重复的数据
   * @param saveParams 
   */
  protected async checkDatas(saveParams:ISaveParam<Do>){
    let bPks = this.getBussinessPks();
    if(bPks == null || bPks.length == 0){
      return;
    }
    let existsDatas = await this.findExistsDatasByParam(saveParams);
    let needDels:Do[] = [];
    let sortFun = this.buildSortFun4CheckRepeat();
    ArrayUtil.groupBy({
      array:existsDatas,
      key:bPks,
      fun(list:Do[]){
        if(list.length > 1){
          list.sort(sortFun);
          for(let i = 1;i < list.length;i++){
            needDels.push(list[i]);
          }
        }
      }
    })
    await this.delDatas(needDels);
  }

  /**
   * 查询已经有的数据
   * @param saveParams 
   * @returns 
   */
  protected findExistsDatasByParam(saveParams:ISaveParam<Do>):Promise<Do[]>{
    let dao = this.getDao();  
    let query = saveParams.query;
    if(query == null){
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

  protected buildQueryByDatas(datas:Do[]){
    let bPks = this.getBussinessPks();
    let query:any = {isDel:0};
    for(let bPk of bPks){
      query[bPk] = ArrayUtil.toArrayDis(datas,bPk)
    }
    return query
  }

  protected async delDatas(datas:Do[]){
    let dao = this.getDao();
    await dao.updateArrayWithCols(datas,[],{
      isDel:1
    })
  }

  protected buildSortFun4CheckRepeat(){
    let pkCol = this.getPkCol();
    return function(a:Do,b:Do){
      return b[pkCol] - a[pkCol];
    }
  }
}