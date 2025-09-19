import { ArrayUtil, BeanUtil, Context, Dao, StrUtil } from "../fastsaas";
import ImportorObj from "./dto/ImportorObj";

interface ImportOpt{
  /**
   * 默认值
   */
  defVal?: string;

  paramKeys?:string[];

  key:string;

  needId?:string[];
  /**
   * 不需要domain进行处理
   */
  noDomain?:boolean;

  /**
   * 结果数据不需要拼,使用dao来进行导入的时候用
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

  /**
   * domain中的函数名
   */
  domainFun?:string;
  /**
   * 不检查数据
   */
  noCheck?:boolean
}

/**
 * 一个表的导入类
*/
export default class Importor{
  
  private opt:ImportOpt;

  private runned:boolean;

  getRunned(){
    return this.runned;
  }
  constructor(opt:ImportOpt){
    this.opt = opt;
  }

  /**
   * 转变数据
   * @param data 
   * @param caolMap 
   */
  change(oldData:any,newData:ImportorObj):void{
    let opt = this.opt
    let value = oldData[opt.key];
    if(value == null || value==''){
      value = opt.defVal;
    }
    newData[opt.key] = {name:value};
    
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
    }else{
      return true;
    }
  }


  private needProcessByDomain(context:Context):boolean{
    if(this.opt.noDomain){
      return false;
    }

    let domain = this.getDomain(context);
    if(domain == null){
      return false;
    }
    let domFun = this.getDomainFun();
    return domain[domFun] != null;
  }

  private isEmptyDomainFun(){
    let domainFun = this.opt.domainFun;
    return domainFun == null || domainFun == '';
  }
  /**
   * 处理导入
   * @param context 
   * @param param 
   * @param datas 
   */
  async process(context: Context, param: any, datas: ImportorObj[]):Promise<any> {
    this.runned = true;
    let allNull = this.isAllNull(datas);
    if(allNull && this.isEmptyDomainFun()){
      return null;
    }
     
    
    if(this.needProcessByDomain(context)){
      
      return await this.processByDomain(context,param,datas);
    }else{
      if(!allNull){
        return await this.processByDao(context,param,datas);
      }else{
        return null;
      }
    }
    
    
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
    if(retData.name == null){
      retData.name = opt.defVal;
    }
    if(param != null){
      if(opt.paramKeys == null){
        for(let e in param){
          retData[e] = param[e]
        }
      }else{
        for(let paramKey of opt.paramKeys){
          retData[paramKey] = param[paramKey];
        }
      }
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
  protected async processByDao(context,param,datas: ImportorObj[]):Promise<void>{
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
      array = array.filter(row=>row.name!=null);
      array = ArrayUtil.distinctByKey(array,'name');      
      let ret = await dao.onlyArray({
        query:{
          name:ArrayUtil.toArray(array,'name'),
          ... query
        },
        mapFun:'name',
        array,
        needUpdate:this.opt.needUpdate
      })
      this.join(datas,ret);
      
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





  private getDomain(context: Context){

    return context.get(this.opt.key+'Domain');
  }

  /**
   * 如果domain中实现了onImport方法，则通过import方法来调用
   * @param context 
   * @param param 
   * @param datas 
   */
  async processByDomain(context: Context, param: any, datas: ImportorObj[]):Promise<boolean>{
    
    let domain = this.getDomain(context)
    let domFun = this.getDomainFun()
    if(domain?.[domFun]){
      let ret = await domain[domFun](param,datas, datas.map(row=>this.parseDataToPojo(param,row)));
      if(ret instanceof Array){
        this.join(datas,ret);
      }
      return ret;
    }
    return null;
  }

  private getDomainFun():string{
    let domFun = this.opt?.domainFun
    if(domFun == null || domFun == ''){
      domFun = 'onImport'
    }
    return domFun;
  }

  getKey(){
    return this.opt.key;
  }
  /**
   * 该列所有对应的数据为空
   * @param datas 
   * @returns 
   */
  isAllNull(datas:ImportorObj[]):boolean{
    let key = this.opt.key;
    for(let data of datas){
      if(data[key]!=null && data[key].name != null){
        return false;
      }
    }
    return true;
  }

  /**
   * 判断有没有运行
   * @param importors 
   * @returns 
   */
  private needAllRun(importors:Importor[]):boolean{
    let needIds = this.opt.needId;
    
    for(let needId of needIds){
      let need = importors.find(row=>row.getKey().toLowerCase()==needId.toLowerCase())
      if(need != null && !need.getRunned()){
        return false;
      }
    }
    return true;
  }
  isReady(datas: ImportorObj[],importors:Importor[]):boolean {
    if(this.opt.noCheck){
      return this.needAllRun(importors)
    }
    if(this.isAllNull(datas)){
      return true;
    }
    let needId = this.opt.needId;
    if(needId != null){
      for(let key of needId){
        let allNull = true;
        let allNameNull = true; 
        for(let data of datas){
          if(data[key] != null && data[key].name != null){
            allNameNull = false;
          }
          if(data[key]!=null && data[key].id != null){
            allNull = false;
            break;
          }

        }
        if(!allNameNull && allNull){
          return false;
        }
      }
    }
    return true;
  }

}