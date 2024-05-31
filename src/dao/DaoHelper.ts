import { ArrayUtil, BaseCdt, Context, Dao, Query, Searcher } from "../fastsaas";

type nameMap = {
  [name:string]:any
}
/**
 * 一个dao的工具类，通过反射机制查询各种数据，主要给单元测试用
 */
interface DaoHelperOpt{
  context:Context
}
export default class DaoHelper{
  private opt:DaoHelperOpt;
  private nameMaps:{[key:string]:nameMap} = {};
  constructor(opt:DaoHelperOpt){
    this.opt = opt;
  }

  async findCount(key:string,col:string|null,cdt){
    let query = new Query();
    if(col == null){
      query.col('count(*) as cnt');
    }else{
      query.col(`count(distinct ${col}) as cnt`);
    }
    query.addCdt(BaseCdt.parse(cdt));
    let list = await this.getDao(key).find(query);
    return list[0].cnt
  }
  /**
   * 找到一个
   * @param key 
   * @param query 
   */
  async findOne(key:string,query:any){
    let list = await this.find(key,query);
    return list[0];
  }
  /**
   * 增加数据
   * @param key 
   * @param list 
   */
  async  addArray(key,list:any[]){
    let dao = this.getDao(key);
    await dao.addArray(list);
  }
  async findSum(key:string,col:string,cdt):Promise<number>{
    let query = new Query();
    query.col(`sum(${col}) as cnt`);
    query.addCdt(BaseCdt.parse(cdt));
    let list = await this.getDao(key).findData(query);
    if(list.length == 0){
      return 0;
    }
    return list[0].cnt;

  }
  /**
   * 根据条件和表格进行删除
   * @param key 
   * @param query 
   */
  async delByCdt(key:string,query:any){
    let dao = this.getDao(key);
    await dao.delByCdt(query);
  }

  /**
   * 根据name进行查询并且放入缓存
   * @param key 
   * @param names 
   */
  async loadByNames(key:string,names:string[]){
    let datas = await this.find(key,{
      name:names
    })
    this.nameMaps[key] = ArrayUtil.toMapByKey(datas,'name')
    
  }
  /**
   * 根据id查询
   * @param key 
   * @param id 
   * @returns 
   */
  async getById(key:string,id:number){
    return this.getSearcher(key).getById(id);
  }

  async findByIds(key:string,ids:number[]){
    return this.getSearcher(key).findByIds(ids);
  }

  private getSearcher(key:string):Searcher{
    return this.opt.context.get(key+"Searcher");
  }
  async getByName(key:string,name:string){
    let data = this.getFromCache(key,name);
    if(data == null){
      data = await this.getByDb(key,name);
      if(data != null){
        this.saveToCache(key,name,data)
      }
    }
    return data;

  }

  private saveToCache(key:string,name:string,data:any){
    let cache = this.getCacheMap(key);
    cache[name] = data;
  }

  private getCacheMap(key:string){
    let cacheMap = this.nameMaps[key];
    if(cacheMap == null){
      cacheMap = {}
      this.nameMaps[key] = cacheMap;
    }
    return cacheMap;
  }

  private getFromCache(key:string,name:string){
    let data = this.nameMaps[key]?.[name];
    return data;
  }

  private async getByDb(key:string,name:string){
    
    let list = await this.find(key,{name});
    return list[0]
  }

  async find(key:string,query:any):Promise<any[]>{
    let dao = this.getDao(key);
    let list = await dao.find(query);
    list = list.filter(row=>row.isDel != 1);
    return list;
  }

  private getDao(key:string):Dao{
    return this.opt.context.get(key+"Dao");
  }


}