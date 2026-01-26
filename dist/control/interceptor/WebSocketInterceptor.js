"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFac_1 = __importDefault(require("../../config/ConfigFac"));
/**
 * 拦截器的父类
 */
class WebSocketInterceptor {
    setSocketProcessor(socketProcessor) {
        this.socketProcessor = socketProcessor;
    }
    setContext(context) {
        this.context = context;
    }
    /**
     * 是否有效
     * @param req
     * @returns
     */
    isValid(url) {
        let path = url;
        let paths = this.getPaths();
        let ret = false;
        for (let strPath of paths) {
            if (path.startsWith(strPath)) {
                ret = true;
                break;
            }
        }
        if (this.isNot()) {
            ret = !ret;
        }
        return ret;
    }
    getPaths() {
        return [this.getPath()];
    }
    /**
     * 匹配的路径
     */
    getPath() {
        return null;
    }
    ;
    isNot() {
        return false;
    }
    /**
     *
     * @param req
     * @param resp
     * @returns 返回true表示停止运行
     */
    async onWebSocketBefore(url, param) {
        if (this.isValid(url)) {
            try {
                await this.doOnBefore(param, url);
            }
            catch (e) {
                this.socketProcessor.sendError(e);
                return true;
            }
        }
        return false;
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
            let base = ConfigFac_1.default.get('base');
            if (base.env == 'local' || base.env == 'test') {
                errorData.stack = e.stack;
            }
        }
        resp.status(500).json({
            error: errorData
        });
    }
    getSocketProcessor() {
        return this.socketProcessor;
    }
}
exports.default = WebSocketInterceptor;
