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

export default class {
  private opt:ImportorManagerOpt;
  constructor(opt:ImportorManagerOpt){
    this.opt = opt;
  }

  async process(context:Context,param:any,dataArray:any[],colMap?:any):Promise<ImportorResult>{
    let imports = this.opt.importors;
    let count = 0;
    let datas:ImportorObj[] = this.change(dataArray,colMap);
    
    for(let importor of imports){
      let importorChecked = await importor.checked(context,param,datas);
      if(!importorChecked){
        return {
          checked:false,
          datas
        }
      }
    }
    while(imports.length>0){
      if(count++>200){
        throw new Error('死循环了？');
      }
      let noRuned = true;
      let nextArray = [];
      for(let importor of imports){
        if(importor.isReady(datas)){
          await importor.process(context,param,datas);
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
    return {checked:true};
  }
  /**
   * 转变数据
   * @param data 
   * @param caolMap 
   */
  protected change(data:any[],colMap):ImportorObj[]{
    let retArray:ImportorObj[] = []
    for(let row of data){
      if(row != null){
        let data:ImportorObj = {};
        for(let e in row){
          let e1 = colMap?.[e];
          if(e1 == null){
            data[e] = {name:row[e]};
          }else{
            data[e1] = {name:row[e]};
          }
        }
        retArray.push(data);
      }
    }
    return retArray;
  }
}