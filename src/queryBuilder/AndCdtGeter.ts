import { AndCdt, ArrayUtil, BaseCdt, Context, Query } from "../fastsaas";
import AndCdtGeterOpt from "./AndCdtGeterOpt";
import BaseLinkOpt from "./BaseLinkOpt";
import { LinkCdtResult } from "./LinkCdtImp";
import LinkCdtOpt from "./LinkCdtOpt";

/**
 * 取and的cdt
 */
export default class AndCdtGeter{
  private opt:AndCdtGeterOpt
  constructor(opt:AndCdtGeterOpt){
    this.opt = opt;
    
  }
  setContext(context:Context){
    if(this.opt != null){
      this.opt.context = context
    }
  }

  setParam(param:any){
    if(this.opt != null){
      this.opt.param = param
    }
  }

  isHit(key:string):boolean{
    return this.opt.impsMap[key] != null;
  }

  async processQuery(query:Query,param:any):Promise<Query>{
    if(this.opt != null && this.opt?.param == null ){
      this.opt.param = param;
    }
    let result = await this.buildCdt(param);
    if(!result.hasValue){
      return query;
    }

    let cdt = result.cdt;
    if(cdt == null){
      return null
    }
    query.addCdt(cdt)
    return query
  }

  protected async buildCdt(param:any):Promise<{
    cdt?:BaseCdt;
    hasValue:boolean;
  }>{
    let impMap = this.opt.impsMap;
    let list:LinkCdtResult[] = [];
    let hasValue:boolean  = false;
    for(let e in impMap){
      let imp = impMap[e]
      imp.setSchCol(e);
      let value = param[e];
      if(value != null){
        let result = await imp.build(param[e],this.buildLinkCdtOpt());
        if(result != null ){
          if(result.array==null || result.array.length==0){
            return {
              hasValue:true
            }
          }
          list.push(result)
        }
        hasValue = true;
      }
    }
    let andCdt = this.buildAndCdt(list)
    
    
    return {
      hasValue,
      cdt:andCdt
    }

  }
  protected buildAndCdt(list: LinkCdtResult[]):BaseCdt{
    if(list.length == 0){
      return null;
    }
    let andCdt = new AndCdt();
    let mapArray = ArrayUtil.toMapArray(list,'col')
    for(let e in mapArray){
      let array:LinkCdtResult[] = mapArray[e];
      let ids = this.combineIds(array);
      if(ids == null || ids.length == 0){
        return null;
      }else{
        andCdt.in(e,ids);
      }
    }

    
    return andCdt;
  }

  protected combineIds( array:LinkCdtResult[]):any[]{
    let ret:any[] = null;
   
    for(let row of array){
      if(row){
        if(row.array == null || row.array.length==0){
          return null;
        }
        if(ret == null ){
          ret = row.array;
        }else{
          ret = ArrayUtil.and(ret,row.array)
        }
      }else{
        return null;
      }
    }
    return ret;
  }

  protected buildLinkCdtOpt():BaseLinkOpt{
    
    let opt = this.opt;
    return opt;
  }

}