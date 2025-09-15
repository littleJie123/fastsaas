import { Context } from "../fastsaas";
import Importor from "./Importor";
import ImportorObj from "./dto/ImportorObj";
import ImportorResult from "./dto/ImportorResult";

/**
 * 导入指挥官
 */
interface ImportorManagerOpt{
  importors:Importor[]

}

export default class ImportorManager {
  private opt:ImportorManagerOpt;
  constructor(opt:ImportorManagerOpt){
    
    this.opt = opt;
  }

  async process(context:Context,param:any,dataArray:any[]):Promise<ImportorResult>{
    let imports = this.opt.importors;
    let count = 0;
    let datas:ImportorObj[] = this.change(dataArray);
    
    for(let importor of imports){
      let importorChecked = await importor.checked(context,param,datas);
      if(!importorChecked){
        return {
          checked:false,
          datas
        }
      }
    }
    let processResult = null;
    while(imports.length>0){
      if(count++>200){
        throw new Error('死循环了？');
      }
      let noRuned = true;
      let nextArray = [];
      for(let importor of imports){
        if(importor.isReady(datas,imports)){
          processResult = await importor.process(context,param,datas);
          noRuned = false;
        }else{
          nextArray.push(importor);
        }
      }
      if(noRuned){
        throw new Error('一个能import的都没有');
      }
      imports = nextArray;
    }
    //返回最后一个的处理结果
    return processResult;
    
  }
  /**
   * 转变数据
   * @param data 
   * @param caolMap 
   */
  protected change(datas:any[]):ImportorObj[]{
    let retArray:ImportorObj[] = []
    for(let data of datas){
      let newData:ImportorObj = {};
      for(let importor of this.opt.importors){
        importor.change(data,newData);  
      }
      retArray.push(newData);
    }
    return retArray;
  }
}