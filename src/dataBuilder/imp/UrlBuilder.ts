import { BeanUtil, HttpUtil, StrUtil } from "../../fastsaas";
import DataBuilder, { DataBuilderOpt, IDataBuilder } from "../DataBuilder";
export interface UrlBuilderOpt<Param=any,Result=any> extends DataBuilderOpt<Param,Result>{
  parseHttpParam?(httpParam:any,result: Result):Promise<any>;
}
export default class UrlBuilder<Param=any,Result=any> extends DataBuilder<Param,Result> {
  private url: string;
  private httpParam: any;
  private method:string;
  protected opt:UrlBuilderOpt<Param,Result>;
  setOpt(opt: UrlBuilderOpt<Param, Result>): IDataBuilder<Param, Result> {
    return super.setOpt(opt);
  }
  getName():string{
    return 'UrlBuilder:'+this.url;
  }
  /**
   * 给子类重写，可以用于更改http的参数
   * @param result 
   * @returns 
   */
  protected async parseHttpParam(result: Result){
    let httpParam = this.httpParam;
    if(this.opt?.parseHttpParam){
      httpParam = await this.opt.parseHttpParam(httpParam,result);
    }
    return httpParam;
  }
  constructor(url: string,httpParam?:any,method?: string) {
    super();
    this.url = url;  
    this.httpParam = httpParam;
    this.method = method;
  }
  protected async doRun(param: Param, result: Result): Promise<Result> {
    let datas = this.buildDataBuilderObj(param,result);
    let url = StrUtil.format(this.url,datas);
    let httpParam =await this.parseHttpParam (result);
    httpParam = BeanUtil.parseJsonFromParam(httpParam,datas);
    let resultData = null;
    if(this.method != null && this.method.toLowerCase() =='post'){
      resultData = HttpUtil.post(url,httpParam)
    }else{
      resultData = HttpUtil.get(url,httpParam)
    }
    return resultData
  }

  
}