import { Context } from "../fastsaas";
import DataBuilderObj from "./DataBuilderObj"

 
export interface IDataBuilder<Param,Result>{
  setRunner?(runner: any): unknown;
  run(param?:Param,result?:Result):Promise<Result>
  getName():string;
  setContext?(context:Context):IDataBuilder<Param,Result>;
}
export interface DataBuilderOpt<Param,Result>{
  pareseResult?(result:Result):Promise<Result>;
  defParam?:Param
  buildRunner?:(result:Result)=>any;
}

export default abstract class DataBuilder<Param = any,Result=any> implements IDataBuilder<Param,Result>{
  protected context:Context;
  protected opt:DataBuilderOpt<Param,Result>;
  /**
   * 上下文
   */
  protected runner:any;

  setRunner(runner:any){
    this.runner = runner;
  }
  protected abstract doRun(param:Param,result:Result):Promise<Result>;


  setContext(context: Context): IDataBuilder<Param, Result> {
    this.context = context;
    return this;
  }
  setOpt(opt:DataBuilderOpt<Param,Result>):IDataBuilder<Param,Result>{
    this.opt = opt;
    return this;
  }
  async run(param?:Param,result?:Result):Promise<Result>{
    if(this.runner == null){
      this.runner = {};
    }
    if(param == null){
      param = this.opt?.defParam;
    }else{
      let defParam = this.opt?.defParam;
      if(defParam == null){
        defParam = {} as any;
      }
      param = {
        ... defParam,
        ... param
      }
    }
    result = await this.doRun(param,result);
    if(this.opt?.pareseResult){
      result = await this.opt.pareseResult(result);
    }
    if(this.opt?.buildRunner && this.runner){
      let runner = await this.opt.buildRunner(result);
      console.log('runner',runner)
      if(runner != null){
        for(let key in runner){
          console.log('runner',key,runner[key])
          this.runner[key] = runner[key];
        }
      }
    }
    console.log(this.runner,'this.runner')
    return result;
  }
  abstract getName():string;


  buildDataBuilderObj(param:Param,result:Result):DataBuilderObj<Param,Result>{
    return {
      param,
      result,
      runner:this.runner,
    }
  }

}