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

  protected async saveDatasByArray(datas:Do[],updateCols?:string[]){
    let pk = this.getPkCol();
    let needAdds:Do[] = [];
    let needUpdates:Do[] = [];
    let dao = this.getDao();
    for(let data of datas){
      if(data[pk] == null){
        needAdds.push(data);
      }else{
        needUpdates.push(data);
      }
    }
    await dao.addArray(needAdds);
    if(updateCols){
      await dao.updateArrayWithCols(needUpdates,updateCols )
    }else{
      await dao.updateArray(needUpdates);
    }
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

  
}