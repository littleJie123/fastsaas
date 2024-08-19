"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 普通的查询
 *
 */
const BaseEsFind_1 = __importDefault(require("./BaseEsFind"));
const BeanUtil_1 = require("./../../../util/BeanUtil");
class default_1 extends BaseEsFind_1.default {
    parseResult(query, result) {
        var _a;
        let logger = this.getContext().getLogger('esDao');
        let list = (_a = result === null || result === void 0 ? void 0 : result.hits) === null || _a === void 0 ? void 0 : _a.hits;
        if (list == null) {
            return [];
        }
        logger.debug('查询数量：' + list.length);
        return list.map(row => {
            let data = {};
            let source = row._source;
            data.id = row._id;
            let cols = query.acqCol();
            if (cols != null && cols.length > 0) {
                for (let col of cols) {
                    col.parseEsHitResult(data, source);
                }
            }
            else {
                BeanUtil_1.BeanUtil.copy(source, data);
            }
            return data;
        });
    }
}
exports.default = default_1;
