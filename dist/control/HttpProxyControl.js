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
const ConfigFac_1 = __importDefault(require("./../config/ConfigFac"));
const BeanUtil_1 = require("./../util/BeanUtil");
const HttpEntryFac_1 = __importDefault(require("./../http/HttpEntryFac"));
const Bean_1 = __importDefault(require("./../context/decorator/Bean"));
const DateUtil_1 = require("./../util/DateUtil");
const Control_1 = __importDefault(require("./Control"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
/**
 * 做http 代理
 */
class HttpProxyControl extends Control_1.default {
    async _parseParam(param) {
        return param;
    }
    /**
     * 返回黑名单
     */
    getBlackList() {
        return null;
    }
    getCheckReqId() {
        return null;
    }
    async _checkReqIdList(req) {
        let reqIdList = this.getCheckReqId();
        if (reqIdList == null)
            return null;
        const hit = ((0, lodash_findindex_1.default)(reqIdList, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1);
        if (hit) {
            // 然后返回锁的信息
            const redisServer = this._context.get("redisServer");
            const baseUrl = req.originalUrl;
            const requestId = req.headers.requestId || req.headers.requestid;
            if (requestId == null)
                return {
                    "error": {
                        "code": "requestId_IsNul",
                        "message": 'requestId not allow null'
                    }
                };
            const key = `${baseUrl}-${requestId}`;
            const lock = await redisServer.lock(key, "", 15 * 60);
            if (lock !== true)
                return {
                    "error": {
                        "code": "requestId_Repeat",
                        "message": 'same url requestId not allow repeat'
                    }
                };
        }
        return null;
    }
    _checkBlackList(req) {
        let blackList = this.getBlackList();
        if (blackList == null)
            return true;
        let token = this._param._token;
        if (token == null) {
            if (((0, lodash_findindex_1.default)(blackList, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1)) {
                return false;
            }
        }
        return true;
    }
    async doExecute(req, resp) {
        if (!this._checkBlackList(req)) {
            resp.status(401);
            return {
                "error": {
                    "code": "TOKEN_ERROR",
                    "message": 'http proxy control token error'
                }
            };
        }
        ;
        const checkError = await this._checkReqIdList(req);
        if (checkError !== null) {
            resp.status(200);
            return checkError;
        }
        let key = this.getKey();
        var path = req.path;
        var httpConfig = ConfigFac_1.default.get('httpconfig');
        var opt = httpConfig[key];
        opt = BeanUtil_1.BeanUtil.shallowCombine(opt, { path });
        var param = this._param;
        param = await this._parseParam(param);
        let headers = req.headers;
        //let headers = {};
        headers['Accept'] = "application/json";
        headers['accept'] = "application/json";
        headers['cache-control'] = "no-cache";
        delete headers['host'];
        if (this._context != null) {
            headers['context_id'] = this._context.getId();
        }
        for (var e in headers) {
            if ("content-length".toLowerCase() == e.toLowerCase() && req.method.toLowerCase() != 'get') {
                delete headers[e];
            }
        }
        if (param._token) {
            headers["_token"] = JSON.stringify(param._token);
            delete param._token;
        }
        if (param._memberToken) {
            headers["_memberToken"] = JSON.stringify(param._memberToken);
            delete param._memberToken;
        }
        if (this.timezoneServer)
            headers['storetime'] = DateUtil_1.DateUtil.formatDate(this.timezoneServer.getDate());
        opt.headers = headers;
        this._printProxyLog(opt);
        let http = HttpEntryFac_1.default.get(req.method, opt);
        //param._url = req.url;
        let date = new Date();
        this._printProxyLog(param);
        let ret = await http.submit(param);
        this._printAfterSubmit(date);
        return ret;
    }
    _printProxyLog(message) {
        let context = this.getContext();
        if (context == null) {
            return;
        }
        let logger = context.getLogger('proxy');
        logger.info(message);
    }
    _printAfterSubmit(date) {
        if (date == null) {
            return;
        }
        let context = this.getContext();
        if (context == null) {
            return;
        }
        let logger = context.getLogger('proxy');
        logger.info(new Date().getTime() - date.getTime());
    }
    _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({});
        }
        else {
            resp.send(ret);
        }
    }
}
exports.default = HttpProxyControl;
__decorate([
    (0, Bean_1.default)()
], HttpProxyControl.prototype, "timezoneServer", void 0);
