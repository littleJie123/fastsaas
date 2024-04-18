import {ArrayUtil} from './../util/ArrayUtil';
import BaseCdt from './../dao/query/cdt/BaseCdt';
import Cdt from './../dao/query/cdt/imp/Cdt';
import NotCdt from './../dao/query/cdt/imp/NotCdt';

export default class<T>  {
  private fun:(T)=>T
  constructor(fun?:(T)=>T){
    if(fun != null){
      this.fun = fun;
    }else{
      this.fun = (id:T)=>id;
    }
  }
  ids:T[];
  notInIds:T[];
  /**
   * 往id里面增加
   * @param ids 
   */
  add(ids:T[]){
    if(ids != null){
      if(this.ids == null ){
        this.ids = ids;
      }else{
        this.ids = ArrayUtil.andByKey(this.ids,ids,this.fun )
      }
    }
  }
  /**
   * 往not in的结果表里面增加
   * @param ids 
   */
  addNotIn(ids:T[]){
    if(ids != null){
      if(this.notInIds == null ){
        this.notInIds = ids;
      }else{
        this.notInIds = ArrayUtil.orByKey(this.notInIds,ids,this.fun )
      }
    }
  }
  /**
   * 返回结果，表示是not in 还是in
   */
  getResult():{ids:T[],notIn:boolean}{
    if(this.ids == null && this.notInIds == null){
      return null;
    }
    if(this.ids != null){
      let ids = this.ids;
      if(this.notInIds != null){
        ids = ArrayUtil.notInByKey(ids,this.notInIds,this.fun);
      }
      return {ids,notIn:false}
    }else{
      if(this.notInIds!=null){
        if(this.notInIds.length == 0)
          return null;
        return {ids:this.notInIds,notIn:true};
      }
    }
  }
  /**
   * 返回一个条件
   * @param colName 
   */
  toCdt(colName:string):BaseCdt{
    let result = this.getResult();
    if(result == null)
      return null;
    if(result.notIn){
      return new NotCdt (new Cdt(colName,result.ids));
    }else{
      return new Cdt(colName,result)
    }
  }
}