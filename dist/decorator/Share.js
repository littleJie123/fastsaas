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
                var _a;
                let superDoExecute = super['_parseRequestParam'];
                let param = this['_param'];
                if (param._shareData != null) {
                    for (let col of cols) {
                        let srcCol = col.srcCol;
                        let destCol = (_a = col.targetCol) !== null && _a !== void 0 ? _a : srcCol;
                        let srcVal = fastsaas_1.JsonUtil.getByKeys(param._shareData, srcCol);
                        if (srcVal != null) {
                            fastsaas_1.JsonUtil.setByKeys(param, destCol, srcVal);
                        }
                        else {
                            throw new Error(`分享数据缺少参数${srcCol}`);
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
