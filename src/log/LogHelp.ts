
type Message = number | string;

type Level = 'INFO' | 'DEBUG' | 'ERROR' | 'DING'
/**
 * 打印日志
 */

interface LoggerOpt {
  context_id?: string | number;
  session_id?: string | number;
  store_id?: string | number;
  brand_id?: string | number;
  category?: string | number;
  other?: any;
  name?: string;
  url?: string;
  request_time?: number;
}

export default class LogHelp {
  private _opt: LoggerOpt;
  setSessionId(sessionId: string) {
    this._opt.session_id = sessionId;
  }

  constructor(opt?: LoggerOpt) {
    if (opt != null) {
      this._opt = opt;
    } else {
      this._opt = {};
    }
  }

  setContextId(contextId: number) {
    this._opt.context_id = contextId
  }

  setCategory(category: string) {
    this._opt.category = category;
  }

  infoObj(obj: any) {
    this.print(obj, 'INFO')
  }
  ding(...message: Message[]) {
    this.print(this.changeMessageToObj(message), 'DING')
  }

  info(...message: Message[]) {

    this.print(this.changeMessageToObj(message), 'INFO')
  }

  private changeMessageToObj(message: Message[]) {
    return {
      message: message.length == 1 ? message[0] : message,
    }
  }

  private getOpt() {
    if (this._opt.name == null) {
      let base = ConfigFac.get('base');
      let name = base.name ?? '';
      this._opt.name = name
    }
    return this._opt;
  }
  private print(obj: any, level: Level) {
    var logtype = this._acqLogType();
    logtype.print({
      ...obj,
      ... this.getOpt(),
      level
    });
  }

  private _acqLogType(): LogType {
    let base = ConfigFac.get('base');
    if (base.envName == 'local' || base.envName == null) {
      return new LocalLog();
    }
    return new DefaultLog();
  }

  error(...message: any) {
    this.print(this.changeMessageToObj(message), 'ERROR')
  }

  debug(...message: any) {
    this.print(this.changeMessageToObj(message), 'DEBUG')
  }

}
import LogType from "./type/LogType";
import DefaultLog from "./type/DefaultLog";
import LocalLog from "./type/LocalLog";
import { ConfigFac } from "../fastsaas";

