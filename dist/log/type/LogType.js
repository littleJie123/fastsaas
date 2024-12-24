"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogType {
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
