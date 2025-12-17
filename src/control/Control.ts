


/**
 * 控制层父亲类
 */
import LogHelp from './../log/LogHelp';
import Context from './../context/Context';
import Bean from './../context/decorator/Bean';
import { Request, Response } from 'express'




interface IExe {
  process(param: any, req: Request, resp: Response): Promise<any>;
}

export default class Control<Param = any, Result = any> {
  protected _param: Param = null;
  protected _req: Request = null;
  protected _resp: Response = null;
  protected _context: Context = null;

  @Bean()
  protected beforeControlProcess: IExe;

  getContext(): Context {
    return this._context;
  }


  /**
   * 返回这次操作的名称
   */
  protected _getName(): string {
    return null;
  }

  /**
   * 数组需要的key列表
   */
  protected _getNeedArrayKeys(): Array<string> {
    return null;
  }
  /**
   * 检查数组形式
   * @param param
   */
  protected _checkArray(param) {
    let array = param.array;

    if (array != null) {
      let keys = this._getNeedArrayKeys();
      if (keys == null)
        return;
      for (let data of array) {
        for (let key of keys) {
          if (data[key] == null || data[key] === '') {
            throw new Error(`数组缺少参数${key}`);
          }
        }
      }
    }
  }

  protected getCheckers(): Array<IChecker> {

    return null
  }
  /**
   * 检查输入参数是否正确
   */
  protected async _checkParam(param) {
    let needParam = this._getNeedParamKey();
    if (needParam != null) {
      for (let key of needParam) {
        let val = JsonUtil.getByKeys(param, key)
        if (val == null || val === '') {
          throw new Error(`缺少参数${key}`);
        }
      }
    }
    let checkers = this.getCheckers();
    if (checkers != null) {
      for (let checker of checkers) {
        await checker.check(param);
      }
    }
  }

  protected async _checkHeader(headers) {
    let needHeaders = this._getNeedHeaderKey();
    if (needHeaders != null) {
      for (let key of needHeaders) {
        if (headers[key] == null || headers[key] === '') {
          throw new Error(`缺少头参数 : ${key}`);
        }
      }
    }
  }

  protected _getNeedParamKey(): Array<string> {
    return null;
  }

  protected _getNeedHeaderKey(): Array<string> {
    return null;
  }

  setContext(context) {
    this._context = context;
  }

  protected _getLogger(category?: string): LogHelp {
    if (category == null)
      category = 'web';
    if (this._context != null) {
      return this._context.getLogger(category);
    }
    return new LogHelp();
  }
  protected _printLog(message: object, category?: string) {

    let logger = this._getLogger(category);
    logger.infoObj(message);

  }

  protected _printBeforeLog(req) {
    try {
      let url: string = req.baseUrl + req.url;
      this._printLog({
        url,
        contextId: this.getContext().getId(),
        param: JSON.stringify(this._param)
      });
    } catch (e) {

    }
  }

  protected _printEndLog(time: number) {
    //this._printLog(time,'webFinish')
    try {
      let logger = this._getLogger('webFinish')
      logger.infoObj({ requestTime: time })
    } catch (e) {

    }

  }
  /**
   * 解析参数
   */
  protected _parseRequestParam() {

  }

  async execute(req: Request, resp: Response) {
    this._req = req;


    this._resp = resp;
    this._param = req['_param'];
    this._parseRequestParam();
    if (this._param == null) {
      this._param = <Param>{};
    }
    let ret;
    let begin = new Date();
    try {
      if (this.beforeControlProcess != null) {
        this.beforeControlProcess.process(this._param, req, resp)
      }

      this._printBeforeLog(req)
      await this._checkHeader(this._req.headers);
      await this._checkParam(this._param);
      await this._checkArray(this._param);

      ret = await this.doExecute(req, resp);

      this._sendResp(resp, ret);
      this._printEndLog(new Date().getTime() - begin.getTime());
    } catch (e) {
      this._printErrorLog(e);
      this._sendError(resp, e);

    }

  }

  protected _sendError(resp, e) {
    var code = e.code;
    if (code == null) {
      code = -1;
    }

    var errorData: any = {
      code,
      status: e?.status,
      message: e?.message,
      data: e?.data

    }

    if (code == -1 && e != null) {
      let base = ConfigFac.get('base');
      if (base.env == 'local' || base.env == 'test') {
        errorData.stack = e.stack
      }
    }
    resp.status(500).json({
      error: errorData
    })
  }


  protected _printErrorLog(error: Error) {
    let base = ConfigFac.get('base');
    if (error['code'] != 0 || base.env == 'local') {
      let logger = this._getLogger();
      logger.error(error);
    }
  }

  protected _sendResp(resp, ret) {
    if (ret == null) {
      resp.send({ result: {} });
    } else {
      const res = this._processRet(ret)
      resp.send({
        result: res
      });
    }
  }

  protected _processRet(ret: any): any {
    try {
      return ret;
    } catch (error) {
      return ret
    }
  }

  protected async doExecute(req?: Request, resp?: Response): Promise<Result> {
    return null;
  }

  async executeParam(param: any, req?: Request, resp?: Response) {
    this._param = param;
    return await this.doExecute(req, resp);
  }

  buildControl(controlClazz): Control {
    let ctrl = new controlClazz()
    let context = this._context;
    if (context != null) {
      if (ctrl.setContext) {
        ctrl.setContext(context);
      }
      context.assembly([ctrl]);
    }
    return ctrl;
  }





}
import IChecker from './inf/IChecker';
import { ConfigFac, JsonUtil } from '../fastsaas';

