import { ArrayUtil, BaseCdt, Cdt, Context, OrCdt, Query } from "../fastsaas";
import LinkCdtImp, { LinkCdtResult } from "./LinkCdtImp";
import LinkCdtOpt from "./LinkCdtOpt";



export default class OrCdtGeter {


  protected opt: LinkCdtOpt;

  constructor(opt: LinkCdtOpt) {
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
  async process(query: Query, val: any): Promise<Query> {
    if (query == null) {
      return null;
    }
    let cdt = await this.build(val)
    if (cdt == null) {
      return null;
    }
    query.addCdt(cdt)
    return query;
  }

  async build(value: any): Promise<BaseCdt> {
    let cdt = new OrCdt();
    let list = this.opt.list;
    let array = [];
    for (let row of list) {
      let ret = await row.build(value, this.opt);
      if(ret != null){
        array.push(ret);
      }
    }
    
    ArrayUtil.groupBy({
      list: array,
      key: 'col',
      fun(array: LinkCdtResult[], e: string) {
        let retArray: any[] = [];
        for (let result of array) {
          retArray.push(... result.array)

        }
    
        if (retArray.length > 0) {
          cdt.in(e, ArrayUtil.distinct(retArray));
        }
      }
    })
    if (cdt.length() == 0) {
      return null;
    }
    return cdt
  }


}