import Control from "./Control";
import { Request, Response } from "express";
/**
 * redis缓存control
 */
export default abstract class RedisCacheControl extends Control {
    private redisServer;
    doExecute(req?: Request, resp?: Response): Promise<any>;
    processParam(req?: Request, resp?: Response): Promise<void>;
    /**
     * 结果数据处理
     * @param ret
     */
    processOther(ret: any, req?: Request): Promise<any>;
    /**
     * 从数据库中查数据
     * @param req
     * @param resp
     */
    abstract getFromDb(req?: Request, resp?: Response): Promise<any>;
    /**
     * 需要从请求参数中拿来拼接到redis的key中的参数
     */
    abstract redisKeyParams(): Array<string>;
    /**
     * 服务名
     */
    abstract getServerName(): string;
    /**
     * 方法名
     */
    abstract getMethodName(): string;
    /**
     * key的生命周期 单位秒
     */
    abstract validTime(): number;
    /**
     * 记录一下缓存命中的日志
     * @param other
     * @private
     */
    private logHitInfo;
    /**
     * 生成redis的key
     * 格式：serverName:methodName:自定义param:...
     * 例: posmobile:listProductByStore_v2:111600331(brandId):800715(storeId):mobile(channel):togo(eatType)
     * @private
     */
    getRedisKey(): Promise<string>;
    /**
     * 从redis中取出对应的数据
     * @private
     */
    private getFromRedis;
    /**
     * 存到redis中
     * @param result
     * @private
     */
    private saveToRedis;
}
