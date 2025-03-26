import path from "path";
import { ArrayUtil, BaseCdt, Context, Dao, DateUtil, IDaoHelper, Query, Searcher, StrUtil } from "../fastsaas";
import fs from 'fs';
import DataCompare from "./DataCompare";
type nameMap = {
  [name:string]:any
}

interface ISchCdt{
  cdt?:any;
  sql?:string;
}
interface ExportResult<Pojo = any>{
  list:Pojo[];
  schCdt:ISchCdt;
}
/**
 * 一个dao的工具类，通过反射机制查询各种数据，主要给单元测试用
 */
interface DaoHelperOpt{
  context:Context
}
export default class DaoHelper implements IDaoHelper{
  private opt:DaoHelperOpt;
  private nameMaps:{[key:string]:nameMap} = {};
  constructor(opt:DaoHelperOpt){
    this.opt = opt;
  }

  async insertByNames(key:string,names:string[]){
    let datas = names.map(name=>({name}));
    let dao = this.getDao(key);
    await dao.addArray(datas);
    for(let data of datas){
      this.saveToCache(key,data.name,data);
    }
  }

  /**
   * 查找数量，col可以填空
   * @param key 
   * @param col 
   * @param cdt 
   * @returns 
   */
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
   * @param paramQuery 
   */
  async findOne(key:string,paramQuery:any,cols?:string[]){
    let dao = this.getDao(key);
    let query = Query.parse(paramQuery);
    if(cols){
      query.col(cols);
    }
    let obj = await dao.findOne(query);
    return obj;
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


  /**
   * 更新数组
   * @param key 
   * @param list 
   */
  async  updateArray(key,list:any[],other?:any,where?:any){
    let dao = this.getDao(key);
    await dao.updateArray(list,other,where);
  }

  async  update(key,obj:any){
    let dao = this.getDao(key);
    await dao.update(obj)
  }
  async findSum(key:string,col:string,cdt):Promise<number>{
    let query = Query.parse(cdt)
    query.col(`sum(${col}) as cnt`);
   // query.addCdt(BaseCdt.parse(cdt));
    let list = await this.getDao(key).findData(query);
    if(list.length == 0){
      return 0;
    }
    return list[0].cnt;

  }

  async findSumByCols(key:string,cols:string[],cdt):Promise<any>{
    let query = new Query();

    query.col(cols.map((col:string)=>{
      if(col.indexOf(' as ') == -1){
        return `sum(${col}) as ${col}`
      }else{
        return col;
      }
    }));
    query.addCdt(BaseCdt.parse(cdt));
    let list = await this.getDao(key).findData(query);
    
    return list[0];

  }
  
  /**
   * 根据条件进行更新
   * @param cdt 
   * @param data 
   */
  async updateByCdt(key:string,whereCdt,data){
    if(whereCdt == null || data == null){
      return;
    } 
    let dao = this.getDao(key);
    let list = await dao.find(whereCdt);
    let array = [];
    for(let obj of list){
      let newObj = {
        [key+'Id']:obj[key+'Id'],
        ...data
      };
      array.push(newObj);
    }
    await dao.updateArray(array)
    //await dao.updateByCdt(whereCdt,data)
  }

  /**
   * 根据条件和表格进行删除
   * @param key 
   * @param query 
   */
  async delByCdt(key:string,query:any){
    let dao = this.getDao(key);
    //await dao.delByCdt(query);
    let list = await dao.find(query);
    await dao.delArray(list);
  }

  /**
   * 根据name进行查询并且放入缓存
   * @param key 
   * @param names 
   */
  async loadByNames(key:string,names:string[],query?:any){
    if(query == null){
      query = {name:names}
    }else{
      query = {
        ... query,
        name:names
      }
    }
    let datas = await this.find(key,query);
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
  async getByName(key:string,name:string,query?:any){
    let data = this.getFromCache(key,name);
    if(data == null){
      data = await this.getByDb(key,name,query);
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

  private async getByDb(key:string,name:string,query?:any){
    if(query == null){
      query = {name}
    }else{
      query = {
        ... query,
        name
      }
    }
    let list = await this.find(key,query);
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



  /**
   * 导出json
   * @param tableName 
   * @param schCdt 
   * @param fileName 
   */
  async exportJson<Pojo = any>(tableName:string,schCdt:ISchCdt,fileName:string):Promise<ExportResult<Pojo>> {
    this.backupFile(fileName);
    
    let list = await this.findBySchCdt(tableName,schCdt);
    //写入文件，没有文件则新增一个
    if(!fs.existsSync(fileName)){
      //写一段代码，如果上述目录不存在则创建目录
      let dir = path.dirname(fileName);
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    fs.writeFileSync(fileName,JSON.stringify({list,schCdt},null,2));
    return {list,schCdt};
  }

  /**
   * 备份文件
   * @param fileName 
   */
  private backupFile(fileName: string) {
    if (fs.existsSync(fileName)) {
      let backupSuffix = 1;
      let backupPath = this.buildBackPath(fileName, backupSuffix);
      
      // 查找可用的备份编号
      while (fs.existsSync(backupPath)) {
        backupSuffix++;
        backupPath = this.buildBackPath(fileName, backupSuffix);
      }
      
      // 执行文件重命名
      fs.renameSync(fileName, backupPath);
      console.log(`已备份旧文件：${backupPath}`);
    }
  }
  private buildBackPath(fileName: string, backupSuffix: number): any {
    let index = fileName.lastIndexOf('.');
    if(index == -1){
      index = fileName.length;
    }
    let suffix = fileName.substring(index);
    let backupPath = `${fileName.substring(0, index)}.${backupSuffix}${suffix}`;
    return backupPath;
  }
  protected async findBySchCdt(tableName:string,schCdt: ISchCdt) {
    let dao = this.getDao(tableName );
    let retList:any[];
    if(schCdt.sql == null){
      retList = await dao.find(schCdt.cdt);
    }else{
      retList = await dao.executeSql(schCdt.sql);
      retList = dao.changeDbArray2Pojo(retList);
    }
    for(let row of retList){
      for(let e in row){
        if(row[e] instanceof Date){
          row[e] = DateUtil.formatDate(row[e]);
        }
      }
    }
    return retList;
  }
  /**
   * 导入json
   * @param tableName 
   * @param fileName 
   */
  async importJson(tableName:string,fileName:string) {
    let data = fs.readFileSync(fileName,'utf8');
    let obj = JSON.parse(data);
    let list = obj.list;
    let schCdt = obj.schCdt;
    let dao = this.getDao(tableName);
    let self = this;
    let pkCol = StrUtil.changeUnderStringToCamel( `${tableName}Id`);
    await dao.onlyArray({
      mapFun:pkCol,
      array:list,
      async finds(){
        let dbList = await self.findBySchCdt(tableName,schCdt);
        let notIds = ArrayUtil.notInByKey(list,dbList,pkCol);
        dbList.push(
          ... (await dao.findByIds(ArrayUtil.toArray(notIds,pkCol)))
        )
        return dbList;
      },
      async adds(list){
        await dao.importArray(list);
        return list;
      },
      needDel:true,
      needUpdate:true
    })
  }

  /**
   * 在测试开始前执行
   */
  async before<Pojo=any>(tableName,cdt:any):Promise<DataCompare<Pojo>>{
    let compare = new DataCompare(this,tableName,cdt);
    await compare.before();
    return compare;
  }
}