import IoRedis from 'ioredis';
export default class RedisServer {
    static __needReg: string;
    protected _client: IoRedis.Redis;
    private getClient;
    lock(key: any, device_id: string, time?: number): Promise<boolean>;
    unlock(key: any, device_id: any): Promise<void>;
    flushdb(): Promise<void>;
    del(key: any): Promise<void>;
    hkeys(key: any): Promise<any>;
    hmset(key: any, array: any): Promise<void>;
    mset(array: any): Promise<void>;
    mget(array: any): Promise<any[]>;
    hdel(key: any, ...field: any[]): Promise<boolean>;
    hvals(key: any): Promise<any>;
    hget(key: any, field: any): Promise<any>;
    hmget(key: any, array: any): Promise<any>;
    expire(key: any, time: any): Promise<void>;
    exists(key: any): Promise<any>;
    incr(id: string, exp?: number): Promise<any>;
    id(id: any): Promise<any>;
    /**
     *
     * @param id
     * @param val
     * @param second 过期时间秒
     */
    set(id: any, val: any, second?: number): Promise<boolean>;
    setNx(id: any, val: any, time?: number): Promise<void>;
    get(id: any): Promise<any>;
    get2(id: any): Promise<any>;
    getset(id: any, val: any): Promise<any>;
    lpush(id: any, val: any): Promise<boolean>;
    rpush(id: any, val: any): Promise<boolean>;
    lpop(id: any): Promise<any>;
    /**
     * 阻塞pop
     * @param id
     */
    blpop(id: any, timeout?: number): Promise<any>;
    /**
     * 阻塞pop
     * @param id
     */
    brpop(id: any, timeout?: number): Promise<any>;
}
