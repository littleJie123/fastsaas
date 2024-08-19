"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonGetHttp_1 = __importDefault(require("./imp/JsonGetHttp"));
const JsonPostHttp_1 = __importDefault(require("./imp/JsonPostHttp"));
const JsonPutHttp_1 = __importDefault(require("./imp/JsonPutHttp"));
const JsonDeleteHttp_1 = __importDefault(require("./imp/JsonDeleteHttp"));
class default_1 {
    static async get(url, param, headers) {
        let jsonHtpp = new JsonGetHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submit(param);
    }
    static async post(url, param, headers) {
        let jsonHtpp = new JsonPostHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submit(param);
    }
    static async put(url, param, headers) {
        let jsonHtpp = new JsonPutHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submit(param);
    }
    static async delete(url, param, headers) {
        let jsonHtpp = new JsonDeleteHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submit(param);
    }
    static async getH(url, param, headers) {
        let jsonHtpp = new JsonGetHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submitReturnWithHeaders(param);
    }
    static async postH(url, param, headers) {
        let jsonHtpp = new JsonPostHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submitReturnWithHeaders(param);
    }
    static async putH(url, param, headers) {
        let jsonHtpp = new JsonPutHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submitReturnWithHeaders(param);
    }
    static async deleteH(url, param, headers) {
        let jsonHtpp = new JsonDeleteHttp_1.default({ url, headers });
        if (param == null)
            param = {};
        return await jsonHtpp.submitReturnWithHeaders(param);
    }
}
exports.default = default_1;
