"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SchIds;
const ArrayUtil_1 = require("../util/ArrayUtil");
/**
 * 分页全选：用 `_schParam` 按列表查询条件拉全量 id（或对象），写入 targetCol。
 * 见 doc/分页选择.md
 */
function SchIds(opt) {
    return function classDecorator(constructor) {
        return class extends constructor {
            async _parseRequestParam(req, resp) {
                var _a;
                let param = this['_param'];
                if (param != null && param._schParam != null) {
                    let context = this['_context'];
                    let ctrl = new opt.control();
                    if (ctrl.setContext) {
                        ctrl.setContext(context);
                    }
                    if (context != null) {
                        context.assembly([ctrl]);
                    }
                    param._schParam._onlyId = true;
                    let result = await ctrl.executeParam(param._schParam, req, resp);
                    let content = (_a = result === null || result === void 0 ? void 0 : result.content) !== null && _a !== void 0 ? _a : [];
                    if (opt.needObj) {
                        param[opt.targetCol] = content;
                    }
                    else {
                        let col = opt.col;
                        if (col == null) {
                            let dao = ctrl.getDao();
                            col = dao.getPojoIdCol();
                        }
                        param[opt.targetCol] = ArrayUtil_1.ArrayUtil.toArray(content, col);
                    }
                }
                let superParse = super['_parseRequestParam'];
                if (superParse) {
                    return await superParse.call(this, req, resp);
                }
            }
        };
    };
}
