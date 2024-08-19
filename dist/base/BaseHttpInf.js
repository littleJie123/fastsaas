"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFac_1 = __importDefault(require("../config/ConfigFac"));
const JsonDeleteHttp_1 = __importDefault(require("../http/imp/JsonDeleteHttp"));
const JsonGetHttp_1 = __importDefault(require("../http/imp/JsonGetHttp"));
const JsonPostHttp_1 = __importDefault(require("../http/imp/JsonPostHttp"));
const JsonPutHttp_1 = __importDefault(require("../http/imp/JsonPutHttp"));
class BaseHttpInf {
    constructor() {
        this.httpConfig = ConfigFac_1.default.get("httpconfig");
    }
    setContext(context) {
        this._context = context;
    }
    getContext() {
        return this._context;
    }
    _printLogger(message) {
        if (this._context == null)
            return;
        const logger = this._context.getLogger("HttpInf");
        logger.info(message);
    }
    async _comHttp(httpMethod, param, opts) {
        const beginTime = new Date().getTime();
        let httpOtp = { ...this.httpOtp, ...this.httpConfig[this.httpHostName] };
        if (opts) {
            for (let e in opts) {
                httpOtp[e] = opts[e];
            }
        }
        if (this._context != null) {
            const context_id = this._context.getId();
            if (httpOtp.headers == null) {
                httpOtp.headers = {};
            }
            httpOtp.headers['context_id'] = context_id;
            // for(let headKey of BaseHttpInf.istio_header_keys){
            //     httpOtp.headers[headKey] = this.buildIstioHeader(headKey);
            // }
        }
        this._printLogger(httpOtp);
        this._printLogger(param);
        const res = await new httpMethod(httpOtp).submit(param);
        const endTime = new Date().getTime();
        this._printLogger({ requestTime: endTime - beginTime });
        return res;
    }
    async post(param, opt) {
        return await this._comHttp(JsonPostHttp_1.default, param, opt);
    }
    async get(param, opt) {
        return await this._comHttp(JsonGetHttp_1.default, param, opt);
    }
    async delete(param, opt) {
        return await this._comHttp(JsonDeleteHttp_1.default, param, opt);
    }
    async put(param, opt) {
        return await this._comHttp(JsonPutHttp_1.default, param, opt);
    }
}
BaseHttpInf.istio_header_keys = [
    'x-request-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'x-b3-sampled',
    'x-b3-flags',
    'x-ot-span-context'
];
exports.default = BaseHttpInf;
