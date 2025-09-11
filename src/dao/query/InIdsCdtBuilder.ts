import { ArrayUtil } from "../../fastsaas";
import { Cdt } from "./cdt/imp";

/**
 * 查询关联表的时候，聚合多个id的查询，避免多个in查询
 */
export default class InIdsCdtBuilder {
  private col: string;
  private ids: number[];

  constructor(col:string){
    this.col = col;
  }
  addIds(ids:number[]){
    if(this.ids == null){
      this.ids = ids;
    }else{
      this.ids = ArrayUtil.and(this.ids,ids);
    }
    
  }

  build():Cdt{
    if(this.ids == null ){
      return null;
    }
    return new Cdt(this.col,this.ids);
  }
}