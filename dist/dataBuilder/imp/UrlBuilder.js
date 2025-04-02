"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../../fastsaas");
const DataBuilder_1 = __importDefault(require("../DataBuilder"));
class UrlBuilder extends DataBuilder_1.default {
    setOpt(opt) {
        return super.setOpt(opt);
    }
    getName() {
        return 'UrlBuilder:' + this.url;
    }
    /**
     * 给子类重写，可以用于更改http的参数
     * @param result
     * @returns
     */
    async parseHttpParam(result) {
        var _a;
        let httpParam = this.httpParam;
        if ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.parseHttpParam) {
            httpParam = await this.opt.parseHttpParam(httpParam, result);
        }
        return httpParam;
    }
    constructor(url, httpParam, method) {
        super();
        this.url = url;
        this.httpParam = httpParam;
        this.method = method !== null && method !== void 0 ? method : 'POST';
    }
    async doRun(param, result) {
        let datas = this.buildDataBuilderObj(param, result);
        let url = fastsaas_1.StrUtil.format(this.url, datas);
        let httpParam = await this.parseHttpParam(result);
        httpParam = fastsaas_1.JsonUtil.parseJson(httpParam, datas);
        let resultData = null;
        if (this.method != null && this.method.toLowerCase() == 'post') {
            resultData = await fastsaas_1.HttpUtil.post(url, httpParam);
        }
        else {
            resultData = await fastsaas_1.HttpUtil.get(url, httpParam);
        }
        console.log('resultData', JSON.stringify(resultData));
        return resultData;
    }
}
exports.default = UrlBuilder;
