import Mapper from "./Mapper";
type ProcessFun<SumPojo,Pojo> = (sumPojo:SumPojo,pre:SumPojo,pojos:Pojo[])=>void

interface ReducerOpt<SumPojo=any ,Pojo=any>{
  pre?:SumPojo;
  sumPojos?:SumPojo[]
  process?(sumPojo:SumPojo,pre:SumPojo,pojos:Pojo[]);
  getPojosBySumPojo?(sumPojo:SumPojo,mapper:Mapper):Pojo[]
}
export default class Reducer<SumPojo=any ,Pojo=any>{
  private opt:ReducerOpt;
  constructor(opt?:ReducerOpt<SumPojo,Pojo>){
    if(opt == null){
      this.opt = {}
    }else{
      this.opt = {
        ... opt
      };
    }
  }
  setFun(fun:ProcessFun<SumPojo,Pojo>){
    this.opt.process = fun
  }
 
  public setPre(pre:SumPojo){
    this.opt.pre = pre;
  }

  process(mapper:Mapper<Pojo>){
    let sumPojos = this.opt.sumPojos;
    for(let sumPojo of sumPojos){
      let list:Pojo[] = this.getPojosBySumPojo(sumPojo,mapper);
      this.doProcess(sumPojo,this.opt.pre,list);
      this.opt.pre = sumPojo
    }
  }

  /**
   * 
   * @param sumPojo 
   */
  protected getPojosBySumPojo(sumPojo:SumPojo,mapper:Mapper):Pojo[]{
    if(this.opt.getPojosBySumPojo){
      return this.opt.getPojosBySumPojo(sumPojo,mapper);
    }
  };
  /**
   * 真正处理
   * @param pre 
   * @param pojos 
   */
  protected  doProcess(sumPojo:SumPojo,pre:SumPojo,pojos:Pojo[]):void{
    if(this.opt?.process != null){
      this.opt.process(sumPojo,pre,pojos)
    }
  };
}