import GetInquiry from "../searcher/inquiry/imp/GetInquiry";

interface CacheOpt {
  paramFun?(param:any):string; 
  cacheClazz?:any
}
/**
 * 用于searcher的缓存，仅仅一个函数
 * @param opt 
 * @returns 
 */
export default function GetCache(opt?: CacheOpt) {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let inquiry = this.get(propertyName)
      let cache = null;
      if(opt?.cacheClazz){
        let CacheClazz:any = opt.cacheClazz
        cache = new CacheClazz({funName:propertyName})
      }
      if(inquiry == null){
        inquiry = new GetInquiry({
          paramFun:opt?.paramFun,
          fun:originalMethod.bind(this),
          cache
        })
        this.reg(propertyName,inquiry)
        
        //应该没啥用
        inquiry.setKey(this.getKey()); 
        inquiry.setContext(this._context);
      }
      
      let ret = await inquiry.find(args[0]);
      if(ret.length == 0){
        return null
      }
      return ret?.[0]?.data
    }
    
    return descriptor;
  }
}