interface CacheOpt {
    paramFun?(param: any): string;
    cacheClazz?: any;
}
/**
 * 用于searcher的缓存，仅仅一个函数
 * @param opt
 * @returns
 */
export default function Cache(opt?: CacheOpt): (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export {};
