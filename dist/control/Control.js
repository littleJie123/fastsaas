"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 控制层父亲类
 */
const LogHelp_1 = __importDefault(require("./../log/LogHelp"));
const Bean_1 = __importDefault(require("./../context/decorator/Bean"));
class Control {
    constructor() {
        this._param = null;
        this._req = null;
        this._resp = null;
        this._context = null;
    }
    getContext() {
        return this._context;
    }
    /**
     * 返回这次操作的名称
     */
    _getName() {
        return null;
    }
    /**
     * 数组需要的key列表
     */
    _getNeedArrayKeys() {
        return null;
    }
    /**
     * 检查数组形式
     * @param param
     */
    _checkArray(param) {
        let array = param.array;
        if (array != null) {
            let keys = this._getNeedArrayKeys();
            if (keys == null)
                return;
            for (let data of array) {
                for (let key of keys) {
                    if (data[key] == null || data[key] === '') {
                        throw new Error(`数组缺少参数${key}`);
                    }
                }
            }
        }
    }
    getCheckers() {
        return null;
    }
    /**
     * 检查输入参数是否正确
     */
    async _checkParam(param) {
        let needParam = this._getNeedParamKey();
        if (needParam != null) {
            for (let key of needParam) {
                let val = fastsaas_1.JsonUtil.getByKeys(param, key);
                if (val == null || val === '') {
                    throw new Error(`缺少参数${key}`);
                }
            }
        }
        let checkers = this.getCheckers();
        if (checkers != null) {
            for (let checker of checkers) {
                await checker.check(param);
            }
        }
    }
    async _checkHeader(headers) {
        let needHeaders = this._getNeedHeaderKey();
        if (needHeaders != null) {
            for (let key of needHeaders) {
                if (headers[key] == null || headers[key] === '') {
                    throw new Error(`缺少头参数 : ${key}`);
                }
            }
        }
    }
    _getNeedParamKey() {
        return null;
    }
    _getNeedHeaderKey() {
        return null;
    }
    setContext(context) {
        this._context = context;
    }
    _getLogger(category) {
        if (category == null)
            category = 'web';
        if (this._context != null) {
            return this._context.getLogger(category);
        }
        return new LogHelp_1.default();
    }
    _printLog(message, category) {
        let logger = this._getLogger(category);
        logger.infoObj(message);
    }
    _printBeforeLog(req) {
        try {
            let url = req.baseUrl + req.url;
            this._printLog({
                url,
                contextId: this.getContext().getId(),
                param: JSON.stringify(this._param)
            });
        }
        catch (e) {
        }
    }
    _printEndLog(time) {
        //this._printLog(time,'webFinish')
        try {
            let logger = this._getLogger('webFinish');
            logger.infoObj({ requestTime: time });
        }
        catch (e) {
        }
    }
    /**
     * 解析参数
     */
    _parseRequestParam() {
    }
    async execute(req, resp) {
        this._req = req;
        this._resp = resp;
        this._param = req['_param'];
        this._parseRequestParam();
        if (this._param == null)
            this._param = {};
        let ret;
        let begin = new Date();
        try {
            if (this.beforeControlProcess != null) {
                this.beforeControlProcess.process(this._param, req, resp);
            }
            this._printBeforeLog(req);
            await this._checkHeader(this._req.headers);
            await this._checkParam(this._param);
            await this._checkArray(this._param);
            ret = await this.doExecute(req, resp);
            this._sendResp(resp, ret);
            this._printEndLog(new Date().getTime() - begin.getTime());
        }
        catch (e) {
            this._printErrorLog(e);
            this._sendError(resp, e);
        }
    }
    _sendError(resp, e) {
        var code = e.code;
        if (code == null) {
            code = -1;
        }
        var errorData = {
            code,
            status: e === null || e === void 0 ? void 0 : e.status,
            message: e === null || e === void 0 ? void 0 : e.message,
            data: e === null || e === void 0 ? void 0 : e.data
        };
        if (code == -1 && e != null) {
            let base = fastsaas_1.ConfigFac.get('base');
            if (base.env == 'local' || base.env == 'test') {
                errorData.stack = e.stack;
            }
        }
        resp.status(500).json({
            error: errorData
        });
    }
    _printErrorLog(error) {
        let base = fastsaas_1.ConfigFac.get('base');
        if (error['code'] != 0 || base.env == 'local') {
            let logger = this._getLogger();
            logger.error(error);
        }
    }
    _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({ result: {} });
        }
        else {
            const res = this._processRet(ret);
            resp.send({
                result: res
            });
        }
    }
    _processRet(ret) {
        try {
            return ret;
        }
        catch (error) {
            return ret;
        }
    }
    async doExecute(req, resp) {
        return null;
    }
    async executeParam(param) {
        this._param = param;
        return await this.doExecute();
    }
    buildControl(controlClazz) {
        let ctrl = new controlClazz();
        let context = this._context;
        if (context != null) {
            if (ctrl.setContext) {
                ctrl.setContext(context);
            }
            context.assembly([ctrl]);
        }
        return ctrl;
    }
}
exports.default = Control;
__decorate([
    (0, Bean_1.default)()
], Control.prototype, "beforeControlProcess", void 0);
const fastsaas_1 = require("../fastsaas");
