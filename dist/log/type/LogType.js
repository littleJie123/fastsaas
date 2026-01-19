"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const fastsaas_1 = require("../../fastsaas");
// 定义日志格式
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `{"timestamp":"${timestamp}","message" : ${message}}`;
}));
let logger = null;
let loggerInited = false;
function getLoger() {
    // 创建按天滚动的运输层
    if (logger == null && !loggerInited) {
        loggerInited = true;
        let log = fastsaas_1.ConfigFac.get('log');
        if (log.filePath) {
            const dailyRotateTransport = new winston_1.default.transports.DailyRotateFile({
                filename: path_1.default.join(log.filePath, 'log%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true, // 压缩旧日志
                maxSize: '20m', // 每个文件最大 20MB
                maxFiles: '14d', // 保留最近 14 天的日志
                format: logFormat
            });
            logger = winston_1.default.createLogger({
                level: 'info',
                transports: [
                    dailyRotateTransport
                ]
            });
        }
    }
    return logger;
}
class LogType {
    getLoggerWiter() {
        return getLoger();
    }
    _parseMsg(list) {
        let message;
        if (list.length == 1) {
            if (!(typeof (list[0]) == 'string')) {
                message = this._stringify(list[0]);
            }
            else {
                message = list[0];
            }
        }
        else {
            message = this._stringify(list);
        }
        return message;
    }
    _stringify(msg) {
        var ret = null;
        try {
            ret = JSON.stringify(msg);
        }
        catch (e) {
            console.log(e);
        }
        return ret;
    }
}
exports.default = LogType;
