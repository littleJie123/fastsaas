import IColChanger from "../colChanger/IColChanger";
import Dao from "../Dao";
import DaoOpt from "./DaoOpt";
export interface JointDaoParam {
    daos: Dao[];
}
/**
 * 联合查询的 DaoOpt
 * getTableName 返回 inner join sql
 * getColChanger 返回 JointColChanger
 */
export default class JointDaoOpt extends DaoOpt {
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
     * 按主键和已加入表的 dbFields 互相对上后，拼 inner join
     * @param joinedDaos 已经在 sql 中的表
     * @param newDao 新加入的表
     */
    private buildJoinSql;
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
