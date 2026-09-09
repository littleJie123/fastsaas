import ColChanger from "./ColChanger";
import Dao from "../Dao";
interface JointColParam {
    daos: Dao[];
}
/**
 * 联合查询的字段转换器
 * 将 pojo 字段转成 tableName.dbField
 */
export default class JointColChanger extends ColChanger {
    private jointDaoOpt;
    constructor(opt: JointColParam);
    /**
     * 将一个内存字段转成 db 字段，并带上所在表名
     * @param pojoField 内存中的字段
     */
    parsePojoField(pojoField: string): string;
    /**
     * 已带表名：从同名表的 dao 中查 pojoFields
     */
    private parseTablePojoField;
    /**
     * 未带表名：按 daos 顺序命中第一个
     */
    private parsePlainPojoField;
    private findDaoByTableName;
    /**
     * 表名相同，兼容驼峰和下划线
     */
    private isSameTableName;
    private hasPojoField;
    private toTableDbField;
    /**
     * 查询结果转成内存对象
     * 无表名：遍历 daos 转字段名
     * 有表名：挂到对应表的嵌套对象上
     */
    changeDb2Pojo(data: any): any;
    private putDbValue;
    /**
     * inventory.inventory_day -> { inventory: { inventoryDay } }
     */
    private putTableDbValue;
    /**
     * 无表名：遍历 dao 的 dbFields 做字段名转化
     */
    private putPlainDbValue;
    private setNestValue;
    private toPojoTableName;
    private hasDbField;
    private getDbFields;
}
export {};
