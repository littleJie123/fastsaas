import IColChanger from "../colChanger/IColChanger";
import Dao from "../Dao";
import DaoOpt from "./DaoOpt";
/**
 * otherSql 的 key 是被 join 的表名，驼峰和下划线都可以。
 * table1Col='salesRecord.bomCode', table2Col='product.bomCode', op='<>'
 * 按各自 dao 的 colChanger 转成 sales_record.bom_code<>product.bom_code，再拼进 on。
 *
 * jointOpt 的 key 也是被 join 的表。table1Col 是已加入的最后一张表的字段，table2Col 是新表的字段。
 * valueOpt 的 key 是条件所在的表，buildJoinSql 时拼成 表.列=值。
 * otherItem + stockRecord 例：
 * other_item.other_item_id=stock_record.note_item_id and stock_record.note_item_type='otherItem'
 */
interface OtherSqlOpt {
    table1Col: string;
    table2Col: string;
    op?: string;
}
interface JointOpt {
    table1Col?: string;
    table2Col?: string;
}
interface ValueOpt {
    col: string;
    value: any;
}
export interface JointDaoParam {
    daos: Dao[];
    otherSql?: {
        [tableName: string]: OtherSqlOpt;
    };
    /**
     * 如果该属不为空，则用表格中指定的 table1Col和 table2Col进行关联.
     * buildJoinSql，其中table1Col 为  joinedDaos 最后一个元素的dao的字段 table2Col为newDao的属性
     */
    jointOpt?: {
        [tableName: string]: JointOpt;
    };
    /**
     * 如果该属不为空，buildJoinSql 的时候要加上sql ${tableName}.${col}=${value}的sql
     */
    valueOpt?: {
        [tableName: string]: ValueOpt;
    };
}
/**
 * 联合查询的 DaoOpt
 * getTableName 返回 inner join sql
 * getColChanger 返回 JointColChanger
 */
export default class JointDaoOpt extends DaoOpt {
    private param;
    private daos;
    private jointColChanger;
    constructor(opt: JointDaoParam);
    getDaos(): Dao[];
    /**
     * 返回 table1 inner join table2 on table2.table2_id=table1.table2_id
     */
    getTableName(): string;
    /**
     * 返回联合查询的字段转换器
     */
    getColChanger(): IColChanger;
    clone(): DaoOpt;
    removeColChange(): DaoOpt;
    /**
     * 按主键和已加入表的 dbFields 互相对上后，拼 inner join。
     * 被 join 的表配了 jointOpt 时，改用 table1Col、table2Col。
     * 参与这次 join 的表配了 valueOpt 时，追加到 on。
     * @param joinedDaos 已经在 sql 中的表
     * @param newDao 新加入的表
     */
    private buildJoinSql;
    /**
     * jointOpt 指定关联列。没有配置时返回 null，交给主键匹配。
     * other_item.other_item_id=stock_record.note_item_id
     */
    private buildJointOptSql;
    /**
     * 已加入的最后一张表和新表上的 valueOpt，拼成 表.列=值。
     */
    private buildValueSql;
    private appendValueSql;
    private formatSqlValue;
    private parseDaoField;
    /**
     * 拼被 join 表上的附加条件。没有配置时返回 null。
     */
    private buildOtherSql;
    /**
     * 按表名取附加条件。key 可以是驼峰或下划线。
     */
    private findOtherSql;
    /**
     * 按表名取配置。key 可以是驼峰或下划线。
     */
    private findByTableName;
    /**
     * salesRecord.bomCode 转成 sales_record.bom_code。
     * 表名找到对应 dao，列名走该 dao 的 colChanger。
     */
    private parseOtherCol;
    private findDaoByTableName;
    private isSameTableName;
    /**
     * 新表主键在老表中，或老表主键在新表中
     */
    private findJoinOn;
    /**
     * 新表主键出现在某张老表的 dbFields 中
     */
    private matchNewPkInOld;
    /**
     * 某张老表主键出现在新表的 dbFields 中
     */
    private matchOldPkInNew;
    private containsDbField;
    private getDbFields;
}
export {};
