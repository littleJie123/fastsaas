"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../fastsaas");
const LogType_1 = __importDefault(require("./LogType"));
class DefaultLog extends LogType_1.default {
    print(opt) {
        let log = fastsaas_1.ConfigFac.get('log');
        let level = opt.level;
        let needPrint = true;
        if (level != null && (log === null || log === void 0 ? void 0 : log.logs) != null) {
            let logs = log.logs;
            needPrint = logs.includes(level);
        }
        if (needPrint) {
            console.log(JSON.stringify(opt));
        }
    }
}
exports.default = DefaultLog;
