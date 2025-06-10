import { JsonUtil } from "../fastsaas";
import IColChanger from "../inf/IColChanger";

/**
 * 读取分享数据
 * @returns 
 */
export default function (cols:IColChanger[]) {

  return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      /**
       * 将分享的数据解析到请求参数中
       * @param req 
       * @param resp 
       * @returns 
       */
      protected async _parseRequestParam(req?: Request, resp?: Response): Promise<any> {
        let superDoExecute = super['_parseRequestParam'];
        let param = this['_param'];
        if(param._shareData != null){
          for(let col of cols){
            let srcCol = col.srcCol;
            let destCol = col.targetCol;
            let srcVal = JsonUtil.getByKeys(param._shareData,srcCol);
            if(srcVal != null){
              JsonUtil.setByKeys(param,destCol,srcVal);
            }else{
              throw new Error(`分享数据缺少参数${srcCol}`);
            }
          }
        }
        if(superDoExecute){
          return await superDoExecute(req,resp);
        }
      }
    }
  }
}