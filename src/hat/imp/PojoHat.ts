import {ArrayUtil} from './../../util/ArrayUtil';
import Context from './../../context/Context';
import {StrUtil} from './../../util/StrUtil';
import Dao from './../../dao/Dao';
import Searcher from './../../searcher/Searcher';

interface PojoHatOpt<Pojo = any>{
  context:Context;
  /**
   * hat table的表名
   */
  key:string;
  /**
   * 自定义处理函数
   * @param data 
   * @param hatData 
   * @returns 
   */
  fun?:(data:Pojo,hatData)=>any;

  overrideFuns?:{[key:string]:Function};
}
/**
 * 基于新结构的hat
 */
export default class<Pojo = any> {
  protected opt:PojoHatOpt<Pojo>;

  constructor(opt:PojoHatOpt<Pojo>){
    this.opt = opt;
    if(opt.overrideFuns != null){
      for(let e in opt.overrideFuns){
        this[e] = opt.overrideFuns[e];
      }
    }
  }

  protected getContext(){
    return this.opt.context;
  }

  protected getSearcher():Searcher{
    let opt = this.opt;
    return this.getContext().get(`${opt.key}Searcher`)
  }

  protected getDao():Dao{
    let opt = this.opt;
    return this.getContext().get(`${opt.key}Dao`)
  }

  /**
   * 返回hat table的主键
   * @returns 
   */
  protected getColOfHatTable(){
    let dao = this.getDao();
    return dao.getPojoIdCol();
  }
  /**
   * 查询 hat 表里面的数据
   * @param list 
   * @returns 
   */
  protected async findDatasFromHatTable(list:Pojo[]):Promise<any[]>{
    let col = this.getColOfHatTable();
    let ids = ArrayUtil.toArrayDis(list,col);
    if(col.endsWith('Id')){ 
      return this.getSearcher().findByIds(ids);
    }else{
      return this.getDao().find({[col]:ids})
    }
  }
  /**
   * 构建 帽子数据的map
   * @param list 
   * @returns 
   */
  protected async buildHatMap(list:Pojo[]){
    let datas = await this.findDatasFromHatTable(list);
    let pk = this.getColOfHatTable();
    let datasMap = ArrayUtil.toMapByKey(datas,pk)
    return datasMap;
  }

  async process(list:Pojo[]) :Promise<any[]>{
    let datasMap = await this.buildHatMap(list);
    let pk = this.getColOfHatTable();
    let ret = [];
    for(let row of list){
      let hatData = datasMap[row[pk]];
      let retData = null;
      if(hatData == null){
        hatData = this.getDefHatData(row);
      } 
      if(hatData != null){
        retData = this.doProcessHatData(row,hatData)
      }
      if(retData == null){
        ret.push(row);
      }else{
        ret.push(retData);
      }
    }
    return ret;
  }
  /**
   * 处理一条记录
   * @param data 
   * @param hatData 
   * @returns 
   */
  protected doProcessHatData(data,hatData){
    if(this.opt.fun == null){
      return this.processData(data,hatData)
    }else{
      return this.opt.fun(data,hatData)
    }
  }
  /**
   * 处理一条记录,可以重载
   * @param data 
   * @param hatData 
   * @returns 
   */
  protected processData(data:Pojo,hatData){
    let name = this.getHatNameCol();
    data[name] = hatData['name'] || hatData[name];
    return null;
  }
  /**
   * 返回拼接到data上name到值，可以重载
   * @returns 
   */
  protected getHatNameCol():string{
    return StrUtil.changeUnderStringToCamel( this.opt.key+'Name')
  }
  /**
   * 构建数据库中没有查到数据的默认数据
   * @param row 
   * @returns 
   */
  protected getDefHatData(row){
    return null;
  }
}