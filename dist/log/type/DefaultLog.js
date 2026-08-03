"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFac_1 = __importDefault(require("../../config/ConfigFac"));
const LogType_1 = __importDefault(require("./LogType"));
class DefaultLog extends LogType_1.default {
    print(opt) {
        let log = ConfigFac_1.default.get('log');
        let level = opt.level;
        let needPrint = true;
        if (level != null && (log === null || log === void 0 ? void 0 : log.logs) != null) {
            let logs = log.logs;
            needPrint = logs.includes(level);
        }
        if (needPrint) {
            let message = opt.message;
            if (message != null && message instanceof Error) {
                opt.message = message.message + "\r\n" + message.stack;
            }
            let str = JSON.stringify(opt);
            console.log(str);
            let fileWriter = this.getLoggerWiter();
            if (fileWriter) {
                fileWriter.info(str);
            }
        }
    }
}
exports.default = DefaultLog;
