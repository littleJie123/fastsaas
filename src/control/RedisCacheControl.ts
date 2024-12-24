import Control from "./Control";
import RedisServer from './../redis/RedisServer';
import Bean from './../context/decorator/Bean';
import LogHelp from './../log/LogHelp';
import { Request, Response } from "express";

/**
 * redis缓存control
 */
export default abstract class RedisCacheControl extends Control {

  @Bean()
  private redisServer: RedisServer;

  async doExecute(req?: Request, resp?: Response) {
    await this.processParam(req, resp);
    let ret = await this.getFromRedis();
    if (ret) {
      //命中缓存的话log一下
      this.logHitInfo("命中" + this.getMethodName() + "缓存");
    } else {
      ret = await this.getFromDb(req, resp);
      await this.saveToRedis(ret);
    }
    ret = await this.processOther(ret, req);
    return ret;
  }

  async processParam(req?: Request, resp?: Response) {
  }

  /**
   * 结果数据处理
   * @param ret
   */
  async processOther(ret, req?: Request) {
    return ret;
  }

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
  private logHitInfo(other: string) {
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
  private async getFromRedis() {
    return await this.redisServer.get(await this.getRedisKey());
  }

  /**
   * 存到redis中
   * @param result
   * @private
   */
  private async saveToRedis(result) {
    let key = await this.getRedisKey();
    await this.redisServer.set(key, result, this.validTime());
  }

}
