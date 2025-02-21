"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const StrUtil_1 = require("./../util/StrUtil");
const Inquiry_1 = __importDefault(require("./../searcher/inquiry/imp/Inquiry"));
const KeysInquiry_1 = __importDefault(require("./../searcher/inquiry/imp/KeysInquiry"));
/**
 * 生成一个默认的search方法
 */
function default_1(opt) {
    return function (target, propertyName, descriptor) {
        descriptor.value = async function (param, col) {
            let key = null;
            let keys = ['get', 'find'];
            for (let k of keys) {
                if (propertyName.startsWith(k)) {
                    key = k;
                    break;
                }
            }
            let inquiry = this.get(propertyName);
            if (inquiry == null) {
                if (opt == null) {
                    opt = {};
                }
                let cols = opt.cols;
                if (cols == null) {
                    cols = propertyName.substring(key.length).split('And');
                    cols = cols.map((key) => {
                        return StrUtil_1.StrUtil.firstLower(key);
                    });
                }
                let cache = null;
                if (this.getIsDel() && opt.otherCdt == null) {
                    opt.otherCdt = { isDel: 0 };
                }
                if (opt.cacheClazz) {
                    let CacheClazz = opt.cacheClazz;
                    cache = new CacheClazz({ funName: propertyName });
                }
                if (cols.length > 1) {
                    inquiry = new KeysInquiry_1.default({
                        otherCdt: opt.otherCdt,
                        keys: cols,
                        cache
                    });
                }
                else {
                    inquiry = new Inquiry_1.default({
                        otherCdt: opt.otherCdt,
                        col: cols[0],
                        cache
                    });
                }
                this.reg(propertyName, inquiry);
                inquiry.setKey(this.getKey());
                inquiry.setContext(this._context);
            }
            let ret = await inquiry.find(param, col);
            if (key == 'get') {
                ret = ret[0];
            }
            return ret;
        };
    };
}
