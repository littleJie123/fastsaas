"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class LogHelp {
    setSessionId(sessionId) {
        this._opt.session_id = sessionId;
    }
    constructor(opt) {
        if (opt != null) {
            this._opt = opt;
        }
        else {
            this._opt = {};
        }
    }
    setContextId(contextId) {
        this._opt.context_id = contextId;
    }
    setCategory(category) {
        this._opt.category = category;
    }
    infoObj(obj) {
        this.print(obj, 'INFO');
    }
    ding(...message) {
        this.print(this.changeMessageToObj(message), 'DING');
    }
    info(...message) {
        this.print(this.changeMessageToObj(message), 'INFO');
    }
    changeMessageToObj(message) {
        return {
            message: message.length == 1 ? message[0] : message,
        };
    }
    getOpt() {
        var _a;
        if (this._opt.name == null) {
            let base = fastsaas_1.ConfigFac.get('base');
            let name = (_a = base.name) !== null && _a !== void 0 ? _a : '';
            this._opt.name = name;
        }
        return this._opt;
    }
    print(obj, level) {
        var logtype = this._acqLogType();
        logtype.print({
            ...obj,
            ...this.getOpt(),
            level
        });
    }
    _acqLogType() {
        let base = fastsaas_1.ConfigFac.get('base');
        if (base.envName == 'local' || base.envName == null) {
            return new LocalLog_1.default();
        }
        return new DefaultLog_1.default();
    }
    error(...message) {
        this.print(this.changeMessageToObj(message), 'ERROR');
    }
    debug(...message) {
        this.print(this.changeMessageToObj(message), 'DEBUG');
    }
}
exports.default = LogHelp;
const DefaultLog_1 = __importDefault(require("./type/DefaultLog"));
const LocalLog_1 = __importDefault(require("./type/LocalLog"));
const fastsaas_1 = require("../fastsaas");
