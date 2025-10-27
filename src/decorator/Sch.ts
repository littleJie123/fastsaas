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
 * 生成一个默认的 search 方法
 *
 * 可以是 **get** 开头或者 **find** 开头
 *
 * 多个字段用 **And** 来进行分割
 *
 * `get` 开头只会返回 1 个元素
 */
export default function(opt?:SchOpt ) {
  return function(target: any, propertyName: string,descriptor: PropertyDescriptor) {
    descriptor.value =async function(param,col?:string){
      let key:string = null;
      let keys = ['get','find'];
      for(let k of keys){
        if(propertyName.startsWith(k)){
          key = k;
          break;
        }
      }

      let inquiry = this.get(propertyName);
      if(inquiry == null){
        if(opt == null){
          opt = {};
        }
        let cols = opt.cols;
        if(cols == null){
          cols = propertyName.substring(key.length).split('And');
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

      let ret = await inquiry.find(param,col);
      if(key == 'get'){
        ret = ret[0]
      }
      return ret;
    }
  }
}
