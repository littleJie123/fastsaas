"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GetCache;
const GetInquiry_1 = __importDefault(require("../searcher/inquiry/imp/GetInquiry"));
/**
 * 用于searcher的缓存，仅仅一个函数
 * @param opt
 * @returns
 */
function GetCache(opt) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            var _a;
            let inquiry = this.get(propertyName);
            let cache = null;
            if (opt === null || opt === void 0 ? void 0 : opt.cacheClazz) {
                let CacheClazz = opt.cacheClazz;
                cache = new CacheClazz({ funName: propertyName });
            }
            if (inquiry == null) {
                inquiry = new GetInquiry_1.default({
                    paramFun: opt === null || opt === void 0 ? void 0 : opt.paramFun,
                    fun: originalMethod.bind(this),
                    cache
                });
                this.reg(propertyName, inquiry);
                //应该没啥用
                inquiry.setKey(this.getKey());
                inquiry.setContext(this._context);
            }
            let ret = await inquiry.find(args[0]);
            if (ret.length == 0) {
                return null;
            }
            return (_a = ret === null || ret === void 0 ? void 0 : ret[0]) === null || _a === void 0 ? void 0 : _a.data;
        };
        return descriptor;
    };
}
