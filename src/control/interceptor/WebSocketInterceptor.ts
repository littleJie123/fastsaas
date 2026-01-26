
import ConfigFac from '../../config/ConfigFac';
import { Context, SocketProcessor } from '../../fastsaas';
/**
 * 拦截器的父类
 */
export default abstract class WebSocketInterceptor {

  protected context: Context;
  protected socketProcessor: SocketProcessor;
  setSocketProcessor(socketProcessor: SocketProcessor) {
    this.socketProcessor = socketProcessor;
  }
  setContext(context: Context) {
    this.context = context
  }
  /**
   * 是否有效
   * @param req 
   * @returns 
   */
  protected isValid(url: string): boolean {
    let path: string = url;
    let paths = this.getPaths();

    let ret = false;
    for (let strPath of paths) {
      if (path.startsWith(strPath)) {
        ret = true;
        break;
      }
    }
    if (this.isNot()) {
      ret = !ret;
    }
    return ret;
  }

  protected getPaths(): string[] {
    return [this.getPath()]
  }
  /**
   * 匹配的路径
   */
  protected getPath(): string {
    return null;
  };
  protected isNot(): boolean {
    return false;
  }
  protected abstract doOnBefore(param: any, url: string): Promise<void>;
  /**
   * 
   * @param req 
   * @param resp 
   * @returns 返回true表示停止运行
   */
  async onWebSocketBefore(url: string, param?: any): Promise<boolean> {
    if (this.isValid(url)) {
      try {
        await this.doOnBefore(param, url);
      } catch (e) {
        this.socketProcessor.sendError(e);

        return true;
      }
    }
    return false;
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

  getSocketProcessor() {
    return this.socketProcessor;
  }
}