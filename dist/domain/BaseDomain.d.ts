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
    /**
     * 根据主键来更新数据
     * @param datas
     * @param updateCols
     */
    protected saveDatasByArray(datas: Do[], updateCols?: string[]): Promise<void>;
    protected delDatas(datas: Do[]): Promise<void>;
    /**
     * 根据业务主键删除重复数据
     * @param query
     */
    protected delRepeatDatas(query: any): Promise<Do[]>;
    /**
     * 通过业务主键查询数据
     * @param datas
     */
    protected schPk4Array(datas: Do[]): Promise<void>;
    /**
     * 将数据库中的数据主键设置到datas中
     * @param datas 内存数据
     * @param dbDatas 数据库数据
     */
    protected setPks(datas: Do[], dbDatas: Do[]): void;
    protected schByBPks(datas: Do[]): Promise<Do[]>;
}
