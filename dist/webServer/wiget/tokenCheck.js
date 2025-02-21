"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tokenCheck;
const ArrayUtil_1 = require("../../util/ArrayUtil");
const JwtToken_1 = __importDefault(require("./JwtToken"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
function checkParam(tokenItem, reqItem, bakItem) {
    if (tokenItem == null && bakItem == null)
        return true;
    let array = [];
    if (tokenItem != null) {
        if (!(tokenItem instanceof Array)) {
            array.push(tokenItem);
        }
        else {
            array.push(...tokenItem);
        }
    }
    if (!(reqItem instanceof Array))
        reqItem = [reqItem];
    if (bakItem != null) {
        if (bakItem instanceof Array) {
            array.push(...bakItem);
        }
    }
    if (reqItem.length > array.length)
        return false;
    let list = ArrayUtil_1.ArrayUtil.and(reqItem, array);
    return list.length == reqItem.length;
}
async function _parse(key, params, req) {
    if (req.method === 'OPTIONS' || req.method === 'options') {
        return;
    }
    const jwtToken = new JwtToken_1.default({ pubcert: params.publicKey });
    let token = req.get(key);
    try {
        if (token == null || token == '') {
            return;
        }
        let tokenInfo = await jwtToken.decode(token);
        if (tokenInfo) {
            if (req._param == null)
                req._param = {};
            req._param['_' + key] = tokenInfo;
        }
    }
    catch (e) {
    }
}
function tokenCheck(params) {
    let exceptUrl = params.exceptUrl || [];
    let tokenStatus = params.tokenStatus; //true需要token，false不需要token
    exceptUrl.push('/debug', '/documentation');
    return async function (req, res, next) {
        let nextStatus = false;
        if (req.method === 'OPTIONS' || req.method === 'options') {
            return next();
        }
        else if (((0, lodash_findindex_1.default)(exceptUrl, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1)) {
            nextStatus = true;
        }
        await _parse('memberToken', params, req);
        // yyk 增加消息中心token解析
        await _parse('messageToken', params, req);
        await _parse('DeviceToken', params, req);
        const jwtToken = new JwtToken_1.default({ pubcert: params.publicKey });
        let token = req.headers.token || req.headers.Token;
        try {
            if (token == null || token == '') {
                if (nextStatus || !tokenStatus) {
                    delete req._param._token;
                    return next();
                }
                res.writeHead(401, { 'Content-Type': 'application/json' });
                let ret = {
                    "error": {
                        "code": "TOKEN_ERROR",
                        "message": 'token error'
                    }
                };
                res.write(JSON.stringify(ret));
                return res.end();
            }
            let tokenInfo = await jwtToken.decode(token);
            if (tokenInfo) {
                for (let item in tokenInfo) {
                    if (req._param[item] && !checkParam(tokenInfo[item], req._param[item], tokenInfo[item + 's'])) {
                        throw new Error("Token Data Error");
                    }
                }
                req._param._token = tokenInfo;
            }
            return next();
        }
        catch (error) {
            if (nextStatus || !tokenStatus) {
                delete req._param._token;
                return next();
            }
            res.writeHead(401, { 'Content-Type': 'application/json' });
            let ret = {
                "error": {
                    "code": "TOKEN_ERROR",
                    "message": error.message || 'token error'
                }
            };
            res.write(JSON.stringify(ret));
            return res.end();
        }
    };
}
