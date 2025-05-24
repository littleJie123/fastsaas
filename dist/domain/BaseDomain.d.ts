import { Context, Dao } from "../fastsaas";
import ISaveParam from "./inf/ISaveParam";
export default abstract class BaseDomain<Do = any> {
    protected _context: Context;
    setContext(context: Context): void;
    getContext(): Context;
    getDao(): Dao<Do>;
    /**
     * 返回业务主键
     */
    protected getBussinessPks(): string[];
    protected getPkCol(): string;
    /**
     * 保存数组
     * @param obj
     */
    saveDatasByParam(saveParams: ISaveParam<Do>): Promise<void>;
    /**
     * 根据业务主键来查询是否有重复的数据
     * @param saveParams
     */
    protected checkDatas(saveParams: ISaveParam<Do>): Promise<void>;
    /**
     * 查询已经有的数据
     * @param saveParams
     * @returns
     */
    protected findExistsDatasByParam(saveParams: ISaveParam<Do>): Promise<Do[]>;
    protected buildQueryByDatas(datas: Do[]): any;
    protected delDatas(datas: Do[]): Promise<void>;
    protected buildSortFun4CheckRepeat(): (a: Do, b: Do) => number;
}
