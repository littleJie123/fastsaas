"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogHelp_1 = __importDefault(require("./../log/LogHelp"));
const TimeCnt_1 = __importDefault(require("../wiget/TimeCnt"));
const SafeDeleteHttp_1 = __importDefault(require("./safeHttp/SafeDeleteHttp"));
const SafeGetHttp_1 = __importDefault(require("./safeHttp/SafeGetHttp"));
const SafePostHttp_1 = __importDefault(require("./safeHttp/SafePostHttp"));
const SafePutHttp_1 = __importDefault(require("./safeHttp/SafePutHttp"));
let httpMap = {};
let errorMap = {};
const S_Timeout = 5000;
const S_Threshold = 100;
class SafeHttpClient {
    setContext(context) {
        this.context = context;
    }
    setOpt(opt) {
        this.opt = opt;
    }
    /**
     * 得到日志工具
     * @returns
     */
    getLogger() {
        if (this.context != null)
            return this.context.getLogger('safeHttpClient');
        let logger = new LogHelp_1.default();
        logger.setCategory('safeHttpClient');
        return logger;
    }
    /**
     * 得到默认值
     * @param url
     */
    getDefValue(url) {
        let map = this.getDefValueMap();
        if (map != null) {
            let path = url.pathname;
            let defValue = map[path];
            if (defValue != null) {
                return {
                    ...defValue,
                    infServerIsNotSafe: true
                };
            }
        }
        return {
            infServerIsNotSafe: true
        };
    }
    /**
     * 得到一个含有默认值的map，键值是url的path
     */
    getDefValueMap() {
        return this.defValueMap;
    }
    setDefValueMap(defValueMap) {
        this.defValueMap = defValueMap;
    }
    /**
     * 得到错误的阈值，超过不再请求返回默认值
     * @returns
     */
    getThreshold() {
        var _a;
        let ret = (_a = this.getOpt()) === null || _a === void 0 ? void 0 : _a.thresh;
        if (ret == null)
            ret = S_Threshold;
        return ret;
    }
    /**
     * 得到
     * @returns
     */
    getOpt() {
        return this.opt;
    }
    /**
     * 得到超时时间
     * @returns
     */
    getTimeout() {
        var _a;
        let ret = (_a = this.getOpt()) === null || _a === void 0 ? void 0 : _a.timeout;
        if (ret == null)
            ret = S_Timeout;
        return ret;
    }
    post(url, params, headers) {
        return this.submit('post', url, params, headers);
    }
    get(url, params, headers) {
        return this.submit('get', url, params, headers);
    }
    put(url, params, headers) {
        return this.submit('put', url, params, headers);
    }
    delete(url, params, headers) {
        return this.submit('delete', url, params, headers);
    }
    /**
     * 得到请求对计数器
     * @param url
     * @returns
     */
    getHttpTimeCnt(url) {
        let host = url.hostname;
        return this.getFromMap(httpMap, host, () => new TimeCnt_1.default(this.getOpt()));
    }
    /**
     * 得到错误的计数器
     * @param url
     * @returns
     */
    getErrorTimeCnt(url) {
        let host = url.hostname;
        return this.getFromMap(errorMap, host, () => new TimeCnt_1.default(this.getOpt()));
    }
    /**
     * 从一个map中取值，没有就新建一个
     * @param map
     * @param key
     * @param fun
     * @returns
     */
    getFromMap(map, key, fun) {
        let ret = map[key];
        if (ret == null) {
            ret = fun();
            map[key] = ret;
        }
        return ret;
    }
    isValid(url) {
        let timeCnt = this.getHttpTimeCnt(url);
        let errorCnt = this.getErrorTimeCnt(url);
        return (timeCnt.get() + errorCnt.get()) < this.getThreshold();
    }
    async submit(method, strUrl, params, headers) {
        if (headers == null) {
            headers = {};
        }
        if (this.context != null) {
            headers = {
                ...headers,
                context_id: this.context.getId()
            };
        }
        let url = new URL(strUrl);
        let logger = this.getLogger();
        let simpleUrl = `${url.hostname}${url.pathname}`;
        logger.infoObj({
            target: url.hostname,
            url: simpleUrl,
            params: JSON.stringify(params),
            action: 'begin'
        });
        if (this.isValid(url)) {
            let timeCnt = this.getHttpTimeCnt(url);
            let errorCnt = this.getErrorTimeCnt(url);
            let timeObj = timeCnt.add();
            let safeHttp = this.getSafeHttp(method);
            if (safeHttp != null) {
                safeHttp.setOpt({
                    onError: (msg) => {
                        logger.ding(`${simpleUrl}出错了,${msg}`);
                        errorCnt.add();
                    },
                    onTimeout: () => {
                        logger.ding(`${simpleUrl}超时了`);
                        errorCnt.add();
                    },
                    timeout: this.getTimeout()
                });
                let timebegin = new Date().getTime();
                let ret = await safeHttp.submit(url, params, headers);
                if (ret == null) {
                    ret = this.getDefValue(url);
                }
                timeObj.obj--;
                logger.infoObj({
                    target: url.hostname,
                    url: simpleUrl,
                    params: JSON.stringify(params),
                    action: 'end',
                    times: new Date().getTime() - timebegin
                });
                return ret;
            }
        }
        else {
            logger.ding(`${simpleUrl} 已经不健康了`);
            return this.getDefValue(url);
        }
    }
    /**
     * 工厂方法
     * @param method
     * @returns
     * @todo
     */
    getSafeHttp(method) {
        if (method == null)
            method = 'post';
        method = method.toLowerCase();
        let ret = null;
        if (method == 'post')
            ret = new SafePostHttp_1.default();
        if (method == 'get')
            ret = new SafeGetHttp_1.default();
        if (method == 'put')
            ret = new SafePutHttp_1.default();
        if (method == 'delete')
            ret = new SafeDeleteHttp_1.default();
        if (ret != null) {
            ret.setOpt(this.getOpt());
        }
        return ret;
    }
}
exports.default = SafeHttpClient;
