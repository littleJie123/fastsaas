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
   * 保存数组
   * @param obj
   */
  async saveDatasByParam(saveParams:ISaveParam<Do>){
    let dao = this.getDao();
    let pkCol = this.getPkCol();
    let needAdds:Do[] = [];
    let needUpdates:Do[] = [];
    let needDels:Do[] = [];
    let bPks = this.getBussinessPks();
    let existing:Do[] = null;
    existing = await this.findExistsDatasByParam(saveParams);
    if(bPks != null && bPks.length >0 ){
      
      let self = this;
      ArrayUtil.joinArray({
        list:saveParams.datas,
        list2:existing,
        key:bPks,
        fun(data:Do,existingDatas:Do[]){
          if(existingDatas.length > 1){
            existingDatas.sort(self.buildSortFun4CheckRepeat())
          }
          data[pkCol] = existingDatas[0][pkCol];
        },
        
      })
    }
    if(saveParams.needDel){
      needDels = ArrayUtil.notInByKey(existing,saveParams.datas,pkCol);
    }
    for(let obj of saveParams.datas){
      if(obj[pkCol]){
        needUpdates.push(obj);
      }else{
        needAdds.push(obj);
      }
    }
    await dao.addArray(needAdds);
    if(saveParams.updateCols){
      await dao.updateArrayWithCols(needUpdates,saveParams.updateCols);
    }else{
      await dao.updateArray(needUpdates);
    }
    await this.delDatas(needDels);
    if(saveParams.needCheck){
      await this.checkDatas(saveParams);
    }
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