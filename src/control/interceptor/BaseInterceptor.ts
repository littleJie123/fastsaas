import {Request,Response} from 'express'
import ConfigFac from '../../config/ConfigFac';
/**
 * 拦截器的父类
 */
export default abstract class BaseInterceptor{
  /**
   * 是否有效
   * @param req 
   * @returns 
   */
  protected isValid(req:Request):boolean{
    let path:string = req.path;
    let paths = this.getPaths();

    let ret =false;
    for(let strPath of paths){
      if(path.startsWith(strPath)){
        ret = true;
        break;
      }
    }
    if(this.isNot()){
      ret = !ret;
    }
    return ret;
  }

  protected getPaths():string[]{
    return [this.getPath()]
  }
  /**
   * 匹配的路径
   */
  protected getPath():string{
    return null;
  };
  protected  isNot():boolean{
    return false;
  }
  protected abstract doOnBefore(req:Request,resp:Response,param?:any):Promise<void>;
  /**
   * 
   * @param req 
   * @param resp 
   * @returns 返回true表示停止运行
   */
  async onBefore(req:Request,resp:Response,param?:any):Promise<boolean>{
    if(this.isValid(req)){
      try{
        await this.doOnBefore(req,resp,param);
      }catch(e){
        console.log('error');
        console.error(e);
        this._sendError(resp,e);

        return true;
      }
    }
    return false;
  }

  protected _sendError(resp,e){
    var code = e.code;
    if (code == null){
      code = -1;
    }

    var errorData:any = {
      code,
      status: e?.status,
      message: e?.message,
      data: e?.data

    }
    
    if(code == -1 && e != null){
      let base = ConfigFac.get('base');
      if(base.env == 'local' || base.env == 'test'){
        errorData.stack = e.stack
      }
    }
    resp.status(500).json({
      error: errorData
    })
  }
}