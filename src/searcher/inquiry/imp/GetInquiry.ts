import BaseInquiry from "../BaseInquiry";
import BaseInquiryOpt from "../BaseInquiryOpt";

interface GetInquiryOpt extends BaseInquiryOpt{
  paramFun?(param:any):string;
  fun(param:any):Promise<any>;
}
export default  class  extends BaseInquiry{

  protected _opt:GetInquiryOpt;
  
  constructor(opt:GetInquiryOpt){
    super(opt);
  }

  protected async  _findFromDb(params: any[]): Promise<any[]> {
    let param = params[0];
    let ret = await this._opt.fun(param);
    return [{
      param,
      data:ret
    }];
  }
  acqDataCode(data: any): string { 
    return this.acqCode(data.param);
  }
  acqCode(param: any): string { 
    
    if(this._opt.paramFun){
      return this._opt.paramFun(param);
    }else{
      if(param == null){
        return '';
      }
      return param.toString();
    }
  }
  
 

  
}