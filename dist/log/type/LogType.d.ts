import winston from 'winston';
import 'winston-daily-rotate-file';
export default abstract class LogType {
    abstract print(obj: any): any;
    protected getLoggerWiter(): winston.Logger;
    protected _parseMsg(list: Array<any>): string;
    protected _stringify(msg: any): string;
}
