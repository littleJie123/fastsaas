"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../fastsaas");
const LogType_1 = __importDefault(require("./LogType"));
var colorMap = {
    red: { begin: '[31m', end: "[m" },
    green: { begin: "[32m", end: "[m" },
    yellow: { begin: "[33m", end: "[m" }
};
class LocalLog extends LogType_1.default {
    print(obj) {
        let fileWriter = this.getLoggerWiter();
        if (fileWriter) {
            fileWriter.info(JSON.stringify(obj));
        }
        let log = fastsaas_1.ConfigFac.get('log');
        let category = obj.category;
        let needPrint = true;
        if ((log === null || log === void 0 ? void 0 : log.category) != null && category != null) {
            let categorys = log.category;
            needPrint = categorys.includes(category);
        }
        if (!needPrint) {
            return;
        }
        let message = obj.message;
        let strArray = [`[${category},${obj.level}]:`];
        if (message == null) {
            strArray.push(JSON.stringify({
                ...obj,
                category: null,
                level: null
            }));
        }
        else {
            if (message instanceof Array) {
                strArray.push(message.join('\r\n'));
            }
            else {
                if (message instanceof Error) {
                    console.log('------------------');
                    strArray.push(message.stack);
                }
                else {
                    strArray.push(message);
                }
            }
        }
        console.log(strArray.join(" "));
    }
}
exports.default = LocalLog;
