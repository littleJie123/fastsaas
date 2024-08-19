import IDaoOpt from "../../inf/IDaoOpt";
import ColChanger from "../colChanger/ColChanger";
export default class DaoOpt {
    _opt: IDaoOpt;
    constructor(opt: IDaoOpt);
    /**
     * 将内存中的字段转成db的字段
     * @param pojoField  内存中的字段
     */
    parsePojoFieldsToDbFields(pojoField: string[]): string[];
    /**
     * 将一个内存的字段转成pos的字段
     * @param pojoField 内存的字段
     */
    parsePojoField(pojoField: string): string;
    /**
     * 返回列的转换器
     * @returns
     */
    getColChanger(): ColChanger;
    /**
     * 返回表名
     */
    getTableName(): string;
    /**
     * @returns poolName
     */
    getPoolName(): string;
    getIds(): string[];
    /**
     * 返回id列表
     */
    acqIds(): Array<string>;
    /**
     * 是否 id[可以兼容判断内存和db的字段]
     * @param col
     */
    isId(col: string): boolean;
    /**
     * 是否自增
     */
    isIncrement(): boolean;
    /**
     * 返回首个数据库id
     */
    acqFirstId(): string;
    /**
     * 返回首个内存中的pojo id
     */
    acqPojoFirstId(): string;
    /**
     * 将db的字段变成pojo的字段
     * @param col
     */
    parseDbField(col: string): string;
}
