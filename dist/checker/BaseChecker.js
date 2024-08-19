"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseChecker {
    constructor(opt) {
        this._opt = null;
        this._opt = this._initOpt(opt);
    }
    _initOpt(opt) {
        return opt;
    }
    getCode() {
        let code = this._opt.code;
        if (code == null) {
            code = "出错了";
        }
        return code;
    }
    async throwError(param) {
        let context = this.getContext();
        let domain = context.get('i18ndomain');
        let code = this.getCode();
        if (domain != null) {
            await domain.throwError(code, param);
        }
        else {
            throw new Error(code);
        }
    }
    ;
    getContext() {
        return this._opt.context;
    }
}
exports.default = BaseChecker;
