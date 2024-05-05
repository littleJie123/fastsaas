import {StrUtil} from './../util/StrUtil';
import Inquiry from './../searcher/inquiry/imp/Inquiry';
import KeysInquiry from './../searcher/inquiry/imp/KeysInquiry';
import BaseCache from "../searcher/inquiry/cache/BaseCache";

interface SchOpt{
  /**
   * 其他查询条件
   */
  otherCdt?:any;
  /**
   * 列名
   */
  cols?:string[];
  /**
   * 存在的cache
   */
  cacheClazz?:Function;
}
/**
 * 生成一个默认的search方法
 */
export default function(opt?:SchOpt ) {
  return function(target: any, propertyName: string,descriptor: PropertyDescriptor) {
    descriptor.value = function(param,col?:string){

      let inquiry = this.get(propertyName);
      if(inquiry == null){
        if(opt == null){
          opt = {};
        }
        let cols = opt.cols;
        if(cols == null){
          cols = propertyName.substring(4).split('And');
          cols = cols.map((key:string):string=>{
            return StrUtil.firstLower(key);
          })
        }
        let cache = null;
        if(this.getIsDel() && opt.otherCdt == null ){
          opt.otherCdt = {isDel:0};
        }
        if(opt.cacheClazz){
          let CacheClazz:any = opt.cacheClazz
          cache = new CacheClazz({funName:propertyName})
        }
        if(cols.length>1){
          inquiry = new KeysInquiry({
            otherCdt:opt.otherCdt,
            keys:cols,
            cache 
          })
        }else{
          inquiry = new Inquiry({
            otherCdt:opt.otherCdt,
            col:cols[0],
            cache 
          })
        }
        this.reg(propertyName,inquiry)
        inquiry.setKey(this.getKey()); 
        inquiry.setContext(this._context);
      }
      return inquiry.find(param,col);
    }
  }
}
