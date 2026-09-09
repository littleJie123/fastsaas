import IColChanger from "../colChanger/IColChanger";
import JointColChanger from "../colChanger/JointColChanger";
import Dao from "../Dao";
import DaoOpt from "./DaoOpt";

export interface JointDaoParam {
  daos: Dao[]
}

/**
 * 联合查询的 DaoOpt
 * getTableName 返回 inner join sql
 * getColChanger 返回 JointColChanger
 */
export default class JointDaoOpt extends DaoOpt {
  private daos: Dao[];
  private jointColChanger: JointColChanger;

  constructor(opt: JointDaoParam) {
    if (opt == null) {
      opt = { daos: [] };
    }
    let jointColChanger = new JointColChanger(opt);
    super({
      colChanger: jointColChanger
    });
    this.daos = opt.daos;
    this.jointColChanger = jointColChanger;
  }

  getDaos(): Dao[] {
    return this.daos;
  }

  /**
   * 返回 table1 inner join table2 on table2.table2_id=table1.table2_id
   */
  getTableName(): string {
    let daos = this.daos;
    if (daos == null || daos.length == 0) {
      return '';
    }
    let sqls = [daos[0].getTableName()];
    let joinedDaos: Dao[] = [daos[0]];
    for (let i = 1; i < daos.length; i++) {
      let newDao = daos[i];
      sqls.push(this.buildJoinSql(joinedDaos, newDao));
      joinedDaos.push(newDao);
    }
    return sqls.join(' ');
  }

  /**
   * 返回联合查询的字段转换器
   */
  getColChanger(): IColChanger {
    return this.jointColChanger;
  }

  clone(): DaoOpt {
    return new JointDaoOpt({
      daos: this.daos
    });
  }

  removeColChange(): DaoOpt {
    this.jointColChanger = null;
    return super.removeColChange();
  }

  /**
   * 按主键和已加入表的 dbFields 互相对上后，拼 inner join
   * @param joinedDaos 已经在 sql 中的表
   * @param newDao 新加入的表
   */
  private buildJoinSql(joinedDaos: Dao[], newDao: Dao): string {
    let onSql = this.findJoinOn(joinedDaos, newDao);
    return `inner join ${newDao.getTableName()} on ${onSql}`;
  }

  /**
   * 新表主键在老表中，或老表主键在新表中
   */
  private findJoinOn(joinedDaos: Dao[], newDao: Dao): string {
    let onSql = this.matchNewPkInOld(joinedDaos, newDao);
    if (onSql != null) {
      return onSql;
    }
    onSql = this.matchOldPkInNew(joinedDaos, newDao);
    if (onSql != null) {
      return onSql;
    }
    throw new Error(`JointDao无法找到${newDao.getTableName()}的关联字段`);
  }

  /**
   * 新表主键出现在某张老表的 dbFields 中
   */
  private matchNewPkInOld(joinedDaos: Dao[], newDao: Dao): string {
    let newPk = newDao.getIdCol();
    let newTable = newDao.getTableName();
    for (let oldDao of joinedDaos) {
      if (this.containsDbField(oldDao, newPk)) {
        return `${newTable}.${newPk}=${oldDao.getTableName()}.${newPk}`;
      }
    }
    return null;
  }

  /**
   * 某张老表主键出现在新表的 dbFields 中
   */
  private matchOldPkInNew(joinedDaos: Dao[], newDao: Dao): string {
    let newTable = newDao.getTableName();
    for (let oldDao of joinedDaos) {
      let oldPk = oldDao.getIdCol();
      if (this.containsDbField(newDao, oldPk)) {
        return `${oldDao.getTableName()}.${oldPk}=${newTable}.${oldPk}`;
      }
    }
    return null;
  }

  private containsDbField(dao: Dao, dbField: string): boolean {
    let dbFields = this.getDbFields(dao);
    return dbFields.indexOf(dbField) != -1;
  }

  private getDbFields(dao: Dao): string[] {
    let colChanger = dao.getColChanger();
    if (colChanger == null) {
      return [];
    }
    return colChanger.parsePojoFieldsToDbFields(dao.getPojoCols());
  }
}
