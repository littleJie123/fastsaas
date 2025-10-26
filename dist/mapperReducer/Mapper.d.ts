import { IGeter } from "../fastsaas";
type Key = number | string;
/**
 * 一个多级的缓存
 */
export default class Mapper<Pojo = any> {
    private mapper;
    private keysLen;
    constructor(datas?: Pojo[], keyGeters?: IGeter[]);
    /**
     * 设置数据,会进行分组
     * @param keyGeters
     * @param datas
     */
    setByGeters(keyGeters: IGeter[], datas: Pojo[]): void;
    add(keys: Key[], datas: Pojo[]): void;
    private init;
    /**
     * 根据keys查询出内存的值
     * @param keys
     * @returns
     */
    get(keys: Key[]): Pojo[];
    /**
     * 返回缓存中所有的实例
     */
    getAll(): Pojo[];
    private getArrayFromMap;
    private doGetArrayFromMap;
}
export {};
