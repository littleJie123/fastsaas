
import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { ConfigFac } from '../../fastsaas';
// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `{"timestamp":"${timestamp}","message" : ${message}}`;
  })
);
let logger: winston.Logger = null
let loggerInited = false;
function getLoger() {
  // 创建按天滚动的运输层
  if (logger == null && !loggerInited) {
    loggerInited = true;
    let log = ConfigFac.get('log');
    if (log.filePath) {
      const dailyRotateTransport = new winston.transports.DailyRotateFile({
        filename: path.join(log.filePath, 'log%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,      // 压缩旧日志
        maxSize: '20m',           // 每个文件最大 20MB
        maxFiles: '14d',          // 保留最近 14 天的日志
        format: logFormat
      });

      logger = winston.createLogger({
        level: 'info',
        transports: [
          dailyRotateTransport
        ]
      });
    }
  }
  return logger;
}

export default abstract class LogType {
  abstract print(obj: any);

  protected getLoggerWiter() {
    return getLoger()
  }

  protected _parseMsg(list: Array<any>): string {

    let message: string;
    if (list.length == 1) {
      if (!(typeof (list[0]) == 'string')) {
        message = this._stringify(list[0])
      } else {
        message = <string>list[0];
      }
    } else {
      message = this._stringify(list);
    }
    return message;
  }

  protected _stringify(msg): string {

    var ret = null;
    try {
      ret = JSON.stringify(msg);
    } catch (e) {
      console.log(e);
    }
    return ret;

  }
}


