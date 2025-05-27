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
     * 保存数组,根据业务主键来判断是否需要新增,更新,删除
     * @param obj
     */
    saveDatasWithBPk(saveParams: ISaveParam<Do>): Promise<void>;
    protected addDatasByArray(datas: Do[]): Promise<void>;
    protected saveDatasByArray(datas: Do[], updateCols?: string[]): Promise<void>;
    /**
     * 查询已经有的数据
     * @param saveParams
     * @returns
     */
    protected findExistsDatasByParam(saveParams: ISaveParam<Do>): Promise<Do[]>;
    protected buildQueryByDatas(datas: Do[]): any;
    protected delDatas(datas: Do[]): Promise<void>;
}
