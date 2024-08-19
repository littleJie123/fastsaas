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
 * 生成一个默认的search方法
 */
export default function (opt?: SchOpt): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export {};
