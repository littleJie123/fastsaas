import { Context, Dao, Searcher } from "../fastsaas";
import IDomainOpt from "./inf/IDomainOpt";
import ISaveParam from "./inf/ISaveParam";
import UpdateOpt from "./inf/UpdateOpt";
export default abstract class BaseDomain<Do = any> {
    protected _context: Context;
    setContext(context: Context): void;
    getContext(): Context;
    getDao(): Dao<Do>;
    getSearcher(): Searcher<Do>;
    /**
     * 返回业务主键
     */
    protected getBussinessPks(): string[];
    protected getPkCol(): string;
    /**
     * 保存数组,根据业务主键来判断是否需要新增,更新,删除
     * @param obj
     */
    saveDatasWithBPk(saveParams: ISaveParam<Do>): Promise<Do[]>;
    /**
     *
     * @param data
     */
    protected saveDoByBPK(data: Do): Promise<Do>;
    getDoByBPK(data: Do): Promise<Do>;
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
    /**
     * 加载数据
     * 会将数据库的数据设置到datas的对应属性里面，如果datas已经设置了数据，则不会被复制
     * @param datas
     * @param opt
     * @returns
     */
    load(datas: Do[], opt?: IDomainOpt<Do>): Promise<Do[]>;
    /**
     * 查询其他表 根据opt的 **loadKeys** 进行加载,loadKeys保存的是表名
     * @param list
     * @param opt
     */
    protected loadOtherTable(list: any[], opt?: IDomainOpt<Do>): Promise<void>;
    /**
     * 查询其他表 根据opt的 **loadKeys** 进行加载,loadKeys保存的是表名
     * @param list
     * @param opt
     */
    protected loadOtherTableToArray(list: any[], opt?: IDomainOpt<Do>): Promise<void>;
    private getSearcherByKey;
    private getDaoByKey;
    private getIdColByKey;
    protected updateWithContext(opt: UpdateOpt<Do>): Promise<Do[]>;
    protected onlyCols(datas: Do[], cols: string[]): Do[];
}
