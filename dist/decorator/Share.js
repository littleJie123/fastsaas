"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const fastsaas_1 = require("../fastsaas");
/**
 * 读取分享数据
 * @returns
 */
function default_1(cols) {
    return function classDecorator(constructor) {
        return class extends constructor {
            /**
             * 将分享的数据解析到请求参数中
             * @param req
             * @param resp
             * @returns
             */
            async _parseRequestParam(req, resp) {
                let superDoExecute = super['_parseRequestParam'];
                let param = this['_param'];
                if (param._shareData != null) {
                    for (let col of cols) {
                        let srcCol = col.srcCol;
                        let destCol = col.targetCol;
                        let srcVal = fastsaas_1.JsonUtil.getByKeys(param._shareData, srcCol);
                        if (srcVal != null) {
                            fastsaas_1.JsonUtil.setByKeys(param, destCol, srcVal);
                        }
                    }
                }
                if (superDoExecute) {
                    return await superDoExecute(req, resp);
                }
            }
        };
    };
}
