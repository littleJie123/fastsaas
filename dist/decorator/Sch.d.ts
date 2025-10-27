interface SchOpt {
    /**
     * 其他查询条件
     */
    otherCdt?: any;
    /**
     * 列名
     */
    cols?: string[];
    /**
     * 存在的cache
     */
    cacheClazz?: Function;
}
/**
 * 生成一个默认的 search 方法
 *
 * 可以是 **get** 开头或者 **find** 开头
 *
 * 多个字段用 **And** 来进行分割
 *
 * `get` 开头只会返回 1 个元素
 */
export default function (opt?: SchOpt): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export {};
