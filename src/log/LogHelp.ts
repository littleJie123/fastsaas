
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

interface ForeverOpt {
  store_id?: string | number;
  brand_id?: string | number;
  oper_name: string;
  oper_param?: any;
  oper_time: string;
  user_id: string;
  user_type: 'eshine_user' | 'member_user' | 'brand_user';
}

export default class LogHelp {
  private static envName: string;
  private static levelMap: any;
  private static _projectName: string;
  private _level: string;
  private _opt: LoggerOpt;


  constructor(opt?: LoggerOpt) {
    if (opt != null)
      this._opt = opt;
    else
      this._opt = {};
    if (this._opt.context_id == null) {
      let now = new Date().getTime();
      let random = Math.floor(Math.random() * 1000);
      this._opt.context_id = now * 1000 + random;
    }
  }


  getProjectName() {
    return LogHelp._projectName;
  }

  set(opt: LoggerOpt): LogHelp {
    if (this._opt == null)
      this._opt = {};

    if (opt != null) {

      for (var e in opt) {


        this._opt[e] = opt[e];
      }
    }
    return this;
  }

  getLevelMap() {
    return LogHelp.levelMap
  }




  info(...message: any) {
    this.setLevel('INFO').print(message);
  }

  infoObj(obj: any, message?: string) {
    this.setLevel('INFO').printObj(obj, message);
  }



  forever(opt: ForeverOpt) {
    this.setLevel('FOREVER').print(' ', opt);
  }

  print(list, obj?) {

    var logtype = this._acqLogType();
    logtype.print(this, list, obj);
  }

  printObj(obj: any, message: string) {

    var logtype = this._acqLogType();
    logtype.printObj(this, obj, message);
  }

  getLevel() {
    return this._level;
  }
  /**
   * 每次一个新的对象，
   * 发挥opt的内容
   */
  getOther(): any {
    var result = {};
    var opt = this._opt;

    for (var e in opt) {
      result[e] = opt[e];
    }
    if (result['other'])
      result['other'] = JSON.stringify(result['other']);
    result['level'] = this._level;

    return result;
  }

  private _acqLogType(): LogType {

    if (LogHelp.envName == 'local' || LogHelp.envName == null)
      return new LocalLog();
    return new DefaultLog();
  }

  setLevel(level: string): LogHelp {
    this._level = level;
    return this;
  }

  setCategory(category: string): LogHelp {
    this._opt.category = category;
    return this;
  }


  error(...message: any) {
    this.setLevel('ERROR').print(message);
  }

  debug(...message: any) {
    this.setLevel('DEBUG').print(message);
  }

  red(...message: any) {
    this.setLevel('red').print(message);
  }

  green(...message: any) {
    this.setLevel('green').print(message);
  }

  yellow(...message: any) {
    this.setLevel('yellow').print(message);
  }

  ding(...message: any) {
    this.setLevel('DING').print(message);
  }
  /**
   * 创建一个loghelp
   * @param req 
   * @param opt 
   */
  static buildLogger(req, opt?: LoggerOpt) {

    if (opt == null)
      opt = {};
    let headers = req.headers;
    let sessionId = null;
    if (headers != null && headers.contextId != null) {
      req._context_id = headers.contextId;
      sessionId = headers.sessionId || headers.session_id;
    }
    if (req._context_id == null) {
      let now = new Date().getTime();
      let random = Math.floor(Math.random() * 1000);
      let _id = now * 1000 + random;
      req._context_id = _id;

    }

    opt.context_id = req._context_id;
    opt.session_id = sessionId;
    return new LogHelp(opt);

  }

  static setProjectName(name: string) {
    LogHelp._projectName = name;
  }

  static setLevels(array: Array<string>) {
    if (array != null) {
      var obj = {};
      for (var key of array) {
        obj[key.toLowerCase()] = true;
      }
      LogHelp.levelMap = obj;
    }
  }
  static setEnvName(envName: string) {
    LogHelp.envName = envName;
  }

}
import LogType from "./type/LogType";
import DefaultLog from "./type/DefaultLog";
import LocalLog from "./type/LocalLog";

