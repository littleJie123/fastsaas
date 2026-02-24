
import { ConfigFac } from "../../fastsaas";
import LogType from "./LogType";


export default class DefaultLog extends LogType {

  print(opt: any) {
    let log = ConfigFac.get('log');
    let level = opt.level;
    let needPrint = true;
    if (level != null && log?.logs != null) {
      let logs: string[] = log.logs;
      needPrint = logs.includes(level)
    }

    if (needPrint) {
      let message = opt.message;
      if (message != null && message instanceof Error) {
        opt.message = message.message + "\r\n" + message.stack
      }

      let str = JSON.stringify(opt)
      console.log(str);
      let fileWriter = this.getLoggerWiter();

      if (fileWriter) {
        fileWriter.info(str);
      }
    }

  }

}

