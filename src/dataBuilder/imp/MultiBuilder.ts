import DataBuilder, { IDataBuilder } from "../DataBuilder";

export default class MultiBuilder<Param=any,Result = any> extends DataBuilder<Param,Result>{
  private builders:IDataBuilder<Param,Result>[];
  constructor(builders:IDataBuilder<Param,Result>[]){
    super();
    this.builders = builders;
  }
  getName():string{
    return 'MultiBuilder';
  }
  async doRun(param:Param,result?:Result):Promise<Result>{
 
    let builders = this.builders;
    try{
      for(let builder of builders){
        if(this.context && builder.setContext){
          builder.setContext(this.context);
        }
        console.log(`*********开始运行：${builder.getName()}**********`)
        result = await builder.run(param,result);
        console.log(`-------结束运行：${builder.getName()}--------`)
      }
    }catch(e){
      console.error(e);
      throw e;
    }
    return result;

  }
}