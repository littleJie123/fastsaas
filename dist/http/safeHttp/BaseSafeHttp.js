"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const S_Timeout = 5000;
class BaseSafeHttp {
    setOpt(opt) {
        this.opt = opt;
    }
    /**
     * 判断是http还是https
     * @param url
     * @returns
     */
    isHttp(url) {
        return !(url.protocol != null
            && url.protocol.length >= 5
            && url.protocol.toLocaleLowerCase().substring(0, 5) == 'https');
    }
    acqClient(url) {
        if (this.isHttp(url))
            return http_1.default;
        return https_1.default;
    }
    /**
     * 将参数 转成 body，默认用json格式
     * @param params
     * @returns
     */
    parseParam2Body(params) {
        let ret = JSON.stringify(params);
        return ret;
    }
    /**
     * 返回超时的时间
     * @returns
     */
    getTimeout() {
        let opt = this.opt;
        let timeout = opt === null || opt === void 0 ? void 0 : opt.timeout;
        if (timeout == null)
            timeout = S_Timeout;
        return timeout;
    }
    getMethod() {
        return 'post';
    }
    buildOptions(url, params, headers, strBody) {
        var _a;
        let port = url.port;
        if (port == null) {
            if (this.isHttp(url)) {
                port = '80';
            }
            else {
                port = '443';
            }
        }
        let rejectUnauthorized = (_a = this.opt) === null || _a === void 0 ? void 0 : _a.rejectUnauthorized;
        return {
            hostname: url.hostname,
            port,
            method: this.getMethod(),
            timeout: this.getTimeout(),
            rejectUnauthorized,
            path: this.buildUrl(url, params),
            headers: this.buildHeaders(headers, strBody)
        };
    }
    needChangeUrl() {
        return false;
    }
    /**
     * 构建url ，get的接口用
     * @param url
     * @param params
     * @returns
     */
    buildUrl(url, params) {
        let pathname = url.pathname;
        //console.log('url.search',url.search);
        if (url.search != '' && url.search != null) {
            let search = url.search;
            if (search.startsWith('?')) {
                search = search.substring(1);
            }
            pathname = `${pathname}?${search}`;
        }
        if (!this.needChangeUrl()) {
            return pathname;
        }
        var array = [];
        for (var e in params) {
            if (typeof params[e] === 'string') {
                array.push(e + '=' + encodeURIComponent(params[e]));
            }
            else {
                if (params[e] instanceof Array) {
                    let vals = params[e];
                    for (let val of vals) {
                        array.push(e + '=' + encodeURIComponent(val));
                    }
                }
                else {
                    array.push(e + '=' + encodeURIComponent(JSON.stringify(params[e])));
                }
            }
        }
        let str = array.join('&');
        let split = '?';
        if (pathname.indexOf('?') != -1) {
            split = '&';
        }
        return `${pathname}${split}${str}`;
    }
    /**
     * 是否需要更改headers
     * @returns
     */
    needChangeHeader() {
        return true;
    }
    /**
     * 返回请求的Content-Type
     */
    getContentType() {
        return 'application/json';
    }
    /**
     * 创建头部
     * @param headers
     * @param strBody
     */
    buildHeaders(headers, strBody) {
        if (!this.needChangeHeader()) {
            return headers;
        }
        let contentType = this.getContentType();
        let conentLength = strBody == null ? 0 : Buffer.byteLength(strBody);
        return {
            ...headers,
            "Content-Type": contentType,
            "Content-length": conentLength
        };
    }
    /**
     * 提交请求
     * @param url
     * @param params
     * @param headers
     * @returns
     */
    submit(url, params, headers) {
        if (params == null)
            params = {};
        let client = this.acqClient(url);
        let opt = this.opt;
        let bodyStr = this.parseParam2Body(params);
        let options = this.buildOptions(url, params, headers, bodyStr);
        let isTimeout = false;
        let self = this;
        return new Promise(function (resolve) {
            let req = client.request(options, function (res) {
                try {
                    let status = res.statusCode;
                    if (status >= 400) {
                        resolve(null);
                        if (opt.onError) {
                            opt.onError(`status is ${status}`);
                        }
                        return;
                    }
                    let chunks = [], length = 0;
                    res.on('data', chunk => {
                        length += chunk.length;
                        chunks.push(chunk);
                    });
                    res.on('end', () => {
                        var buffer = Buffer.alloc(length);
                        for (var i = 0, pos = 0, size = chunks.length; i < size; i++) {
                            chunks[i].copy(buffer, pos);
                            pos += chunks[i].length;
                        }
                        let encode = opt === null || opt === void 0 ? void 0 : opt.encode;
                        if (encode == null)
                            encode = 'utf-8';
                        resolve(self.parseResult(buffer.toString(encode)));
                    });
                }
                catch (e) {
                    console.error(e);
                    resolve(null);
                }
            });
            req.on('error', function (e) {
                if (!isTimeout) {
                    if (opt && (opt === null || opt === void 0 ? void 0 : opt.onError)) {
                        opt.onError(e.message);
                    }
                    resolve(null);
                }
            });
            let timeout = self.getTimeout();
            req.setTimeout(timeout, () => {
                req.abort(); // 如果超时，终止请求
                isTimeout = true;
                if (opt && opt.onTimeout) {
                    opt.onTimeout();
                }
                resolve(null);
            });
            self.writeBody(req, bodyStr);
            req.end();
        });
    }
    /**
     * 是否需要写body
     */
    needWriteBody() {
        return true;
    }
    writeBody(req, bodyStr) {
        if (bodyStr != null && this.needWriteBody()) {
            req.write(bodyStr);
        }
    }
    /**
     *
     * @param str
     * @returns
     */
    parseResult(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            console.log(str);
            console.error(e);
            return null;
        }
    }
}
exports.default = BaseSafeHttp;
