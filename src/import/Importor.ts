import { ArrayUtil, BeanUtil, Context, Dao, StrUtil } from "../fastsaas";
import ImportorObj from "./dto/ImportorObj";

interface ImportOpt{
  key:string;
  needId?:string[];
  /**
   * 不需要domain进行处理
   */
  noDomain?:boolean;

  /**
   * 结果数据不需要拼
   */
  noJoin?:boolean;

  /**
   * dao的process时候用
   */
  query?:any;

  /**
   * 其他列的数据
   */
  otherColMap?:any;
  /**
   * 更新
   */
  needUpdate?:boolean;

  checker?:(context: Context, param: any, datas: ImportorObj[])=>Promise<boolean>
}

/**
 * 一个表的导入类
*/
export default class {
  
  opt:ImportOpt;
  constructor(opt:ImportOpt){
    this.opt = opt;
  }

  async checked(context: Context, param: any, datas: ImportorObj[]):Promise<boolean> {
    let domainRet = await this.checkByDomain( context, param, datas);
    let daoRet = await this.checkByChecker(context,param,datas);
    return domainRet && daoRet;
  }

  /**
   * 通过dao类来进行处理
   * @param context 
   * @param param 
   * @param datas 
   * @returns 
   */
  protected async checkByChecker(context:Context,param,datas: ImportorObj[]):Promise<boolean>{
    let checker = this.opt.checker;
    if(checker == null){
      return true;
    }
    return checker(context,param,datas);
  }
  

  /**
   * 
   * @param context 
   * @param param 
   * @param datas 
   * @returns 
   */
  protected async checkByDomain(context: Context, param: any, datas: ImportorObj[]):Promise<boolean>{
    let noDomain = this.opt.noDomain;
    if(noDomain){
      return true;
    }
    let domain = context.get(this.opt.key+'Domain');
    if(domain?.onImportChecker){
      return await domain.onImportChecker(param,datas, datas.map(row=>this.parseDataToPojo(param,row)));
    }
  }

  /**
   * 处理导入
   * @param context 
   * @param param 
   * @param datas 
   */
  async process(context: Context, param: any, datas: ImportorObj[]):Promise<void> {
    let ret = await this.processByDomain(context,param,datas);
    if(!ret){
      ret = await this.processByDao(context,param,datas);
    }
    this.join(datas,ret);
  }


  /**
   * 将需要导入的数据转成pojo
   * @param param 
   * @param data 
   * @returns 
   */
  protected parseDataToPojo(param,data){
    let opt = this.opt;
    let retData:any = {}
    retData.name = data[opt.key].name;
    for(let e in param){
      retData[e] = param[e]
    }
    let needId = this.opt.needId;
    if(needId != null){
      for(let key of needId){
        let col = this.getIdColByKey(key);
        retData[col] = data[key]?.id
      }
    }
    let otherColMap = this.opt.otherColMap;
    if(otherColMap != null){
      for(let e in otherColMap){
        retData[otherColMap[e]] = data[e]?.name;
      }
    }
    return retData;
  } 

  /**
   * 通过dao类来进行处理
   * @param context 
   * @param param 
   * @param datas 
   * @returns 
   */
  protected async processByDao(context,param,datas: ImportorObj[]):Promise<any[]>{
    let dao:Dao = context.get(this.opt.key +'Dao');
    if(dao != null){
      let query = this.opt.query;
      if(query == null){
        query = {
          ... param,
          isDel:0
        }
      }else{
        query = BeanUtil.parseJsonFromParam(query,param);
      }
      let array = [];
      for(let data of datas){
        array.push(this.parseDataToPojo(param,data))
      }
      array = ArrayUtil.distinctByKey(array,'name');
      
      return await dao.onlyArray({
        query:{
          name:ArrayUtil.toArray(array,'name'),
          ... query
        },
        mapFun:'name',
        array,
        needUpdate:this.opt.needUpdate
      })
    }
  }

  /**
   * 将插入结果和内存中的数据进行关联，并且把id写进内存中的数据
   * @param datas 
   * @param retArray 
   * @returns 
   */
  join(datas:ImportorObj[],retArray:any[]){
    if(datas == null  || retArray == null || retArray.length==0){
      return ;
    }
    if(this.opt.noJoin){
      return;
    }
    let key = this.opt.key;
    let self = this;
    ArrayUtil.joinArray({
      list2:datas,
      list:retArray,
      key2(row){
        return row[key].name
      },
      key:'name',
      fun(retData,rows){
        for(let row of rows){
          row[key].id = retData[self.getIdCol()]
        }
      }
    })
  }

  protected getIdCol(){
    return this.getIdColByKey(this.opt.key);
  }

  protected getIdColByKey(key:string){
    return StrUtil.changeUnderStringToCamel(key)+'Id';
  }






  /**
   * 如果domain中实现了onImport方法，则通过import方法来调用
   * @param context 
   * @param param 
   * @param datas 
   */
  async processByDomain(context: Context, param: any, datas: ImportorObj[]):Promise<any[]>{
    let noDomain = this.opt.noDomain;
    if(noDomain){
      return null;
    }
    let domain = context.get(this.opt.key+'Domain');
    if(domain?.onImport){
      return await domain.onImport(param,datas, datas.map(row=>this.parseDataToPojo(param,row)));
    }
  }

  getKey(){
    return this.opt.key;
  }
  isReady(datas: ImportorObj[]):boolean {
    
    let needId = this.opt.needId;
    if(needId != null){ 
      for(let data of datas){ 
        for(let key of needId){ 
          if(data[key]!=null && data[key].id == null){
            return false;
          }
        }
      }
    }
    return true;
  }

}