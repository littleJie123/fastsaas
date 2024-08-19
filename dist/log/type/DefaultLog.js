"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogType_1 = __importDefault(require("./LogType"));
class DefaultLog extends LogType_1.default {
    printObj(log, obj, msg) {
        var levelMap = log.getLevelMap();
        var level = log.getLevel();
        if (level == null
            || levelMap == null
            || levelMap[level.toLowerCase()]
            || level == 'FOREVER') {
            var otherOpt = log.getOther();
            otherOpt.message = msg;
            if (obj != null) {
                for (let e in obj) {
                    otherOpt[e] = obj[e];
                }
            }
            otherOpt.timestamp = new Date().getTime();
            console.log(this._stringify(otherOpt));
        }
    }
    print(log, list, opt) {
        if (list == null || list.length == 0)
            return;
        var levelMap = log.getLevelMap();
        var level = log.getLevel();
        if (level == null
            || levelMap == null
            || levelMap[level.toLowerCase()]
            || level == 'FOREVER') {
            var otherOpt = log.getOther();
            if (opt != null) {
                for (let e in opt) {
                    otherOpt[e] = opt[e];
                }
            }
            var first = list[0];
            if (!(first instanceof Error)) {
                otherOpt.message = this._parseMsg(list);
            }
            else {
                otherOpt.message = first.message;
                otherOpt.stack = first.stack;
            }
            otherOpt.timestamp = new Date().getTime();
            console.log(this._stringify(otherOpt));
        }
    }
}
exports.default = DefaultLog;
