"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Control_1 = __importDefault(require("./Control"));
const Bean_1 = __importDefault(require("./../context/decorator/Bean"));
/**
 * redis缓存control
 */
class RedisCacheControl extends Control_1.default {
    async doExecute(req, resp) {
        await this.processParam(req, resp);
        let ret = await this.getFromRedis();
        if (ret) {
            //命中缓存的话log一下
            this.logHitInfo("命中" + this.getMethodName() + "缓存");
        }
        else {
            ret = await this.getFromDb(req, resp);
            await this.saveToRedis(ret);
        }
        ret = await this.processOther(ret, req);
        return ret;
    }
    async processParam(req, resp) {
    }
    /**
     * 结果数据处理
     * @param ret
     */
    async processOther(ret, req) {
        return ret;
    }
    /**
     * 记录一下缓存命中的日志
     * @param other
     * @private
     */
    logHitInfo(other) {
        let logger = this.getContext().getLogger("redisCache");
        logger.infoObj({
            name: this.getMethodName(),
            other: other
        });
    }
    /**
     * 生成redis的key
     * 格式：serverName:methodName:自定义param:...
     * 例: posmobile:listProductByStore_v2:111600331(brandId):800715(storeId):mobile(channel):togo(eatType)
     * @private
     */
    async getRedisKey() {
        let params = this._param;
        let keyParams = this.redisKeyParams();
        let key = this.getServerName() + ":" + this.getMethodName();
        for (let keyParam of keyParams) {
            let p = params[keyParam];
            if (p == null || p === '') {
                throw new Error(`缺少参数${keyParam}`);
            }
            key = key + ":" + p;
        }
        return key;
    }
    /**
     * 从redis中取出对应的数据
     * @private
     */
    async getFromRedis() {
        return await this.redisServer.get(await this.getRedisKey());
    }
    /**
     * 存到redis中
     * @param result
     * @private
     */
    async saveToRedis(result) {
        let key = await this.getRedisKey();
        await this.redisServer.set(key, result, this.validTime());
    }
}
exports.default = RedisCacheControl;
__decorate([
    (0, Bean_1.default)()
], RedisCacheControl.prototype, "redisServer", void 0);
