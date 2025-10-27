export type SpanCacheKeyType = number | string;
/**
 * 表示一个范围类
 */
export interface Span {
    begin?: SpanCacheKeyType | null;
    end?: SpanCacheKeyType | null;
}
interface SaveOpt {
    noError?: boolean;
}
export interface SpanOpt<Pojo> {
    findFromDb(span: Span): Promise<Pojo[]>;
    /**
     * 从查询结果的记录获得缓存的key，用于将数据保存到缓存中
     * @param pojo
     */
    getKeyFromPojo(pojo: Pojo): SpanCacheKeyType;
    /**
     * 根据查询参数得到key的数组，用来从缓存中读取数据
     * @param span
     */
    getKeysFromSpan(span: Span): SpanCacheKeyType[];
    /**
     * 判断两个值是否相邻
     * @param keyType1
     * @param keyType2
     */
    isAdjacent?(keyType1: SpanCacheKeyType, keyType2: SpanCacheKeyType): boolean;
}
/**
 * 一个根据范围查询的缓存
 */
export default class SpanCache<Pojo = any> {
    private span;
    private opt;
    private cacheMap;
    constructor(opt: SpanOpt<Pojo>);
    private _gte;
    private _lt;
    private _lte;
    private _gt;
    /**
     * 首先判断参数和this.span是否存在间隙，需要调用opt.isAdjacent方法，
     * 如果存在间隙或者用重叠，则抛出异常。
     * 如果没有则将数据保存到缓存，并且更新this.span
     * @param span
     * @param datas
     */
    saveToCache(param: Span, datas: Pojo[], saveOpt?: SaveOpt): Promise<void>;
    isCouldSave(param: Span): boolean;
    /**
     * 根据范围查询数据，如果传入的参数在缓存中（判断this.span 和param的差异）,
     * 则从缓存中读取数据并且拼装成一个大数组返回
     * 如果不在缓存中，则将param和this.span 比较得出差异的param，
     * 传递给opt.findFromDb方法进行查新（可能需要查询2次）
     * 最后将查询结果保存到cacheMap中并更新this.span
     *
     * @param param
     */
    find(param: Span): Promise<Pojo[]>;
    private updateCache;
    private readFromCache;
}
export {};
