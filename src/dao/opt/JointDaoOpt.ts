import IColChanger from "../colChanger/IColChanger";
import JointColChanger from "../colChanger/JointColChanger";
import Dao from "../Dao";
import { StrUtil } from "../../util/StrUtil";
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

interface OtherSqlOpt{
  table1Col:string;
  table2Col:string;
  op?:string;
}

interface JointOpt{
  table1Col?:string;
  table2Col?:string;
  
}

interface ValueOpt{
  col:string;
  value:any;
  
}

export interface JointDaoParam {
  daos: Dao[]
  otherSql?:{
    [tableName:string]:OtherSqlOpt
  }
  /**
   * 如果该属不为空，则用表格中指定的 table1Col和 table2Col进行关联.
   * buildJoinSql，其中table1Col 为  joinedDaos 最后一个元素的dao的字段 table2Col为newDao的属性
   */
  jointOpt?:{
    [tableName:string]:JointOpt
  },
  /**
   * 如果该属不为空，buildJoinSql 的时候要加上sql ${tableName}.${col}=${value}的sql
   */
  valueOpt?:{
    [tableName:string]:ValueOpt
  }



}

/**
 * 联合查询的 DaoOpt
 * getTableName 返回 inner join sql
 * getColChanger 返回 JointColChanger
 */
export default class JointDaoOpt extends DaoOpt {
  private param: JointDaoParam;
  private daos: Dao[];
  private jointColChanger: JointColChanger;

  constructor(opt: JointDaoParam) {
    if (opt == null) {
      opt = { daos: [] };
    }
    let param = { ...opt };
    let jointColChanger = new JointColChanger(param);
    super({
      colChanger: jointColChanger
    });
    this.param = param;
    this.daos = param.daos;
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
      ...this.param
    });
  }

  removeColChange(): DaoOpt {
    this.jointColChanger = null;
    return super.removeColChange();
  }

  /**
   * 按主键和已加入表的 dbFields 互相对上后，拼 inner join。
   * 被 join 的表配了 jointOpt 时，改用 table1Col、table2Col。
   * 参与这次 join 的表配了 valueOpt 时，追加到 on。
   * @param joinedDaos 已经在 sql 中的表
   * @param newDao 新加入的表
   */
  private buildJoinSql(joinedDaos: Dao[], newDao: Dao): string {
    let onSql = this.buildJointOptSql(joinedDaos, newDao);
    if (onSql == null) {
      onSql = this.findJoinOn(joinedDaos, newDao);
    }
    let extras = [
      this.buildOtherSql(newDao.getTableName()),
      this.buildValueSql(joinedDaos, newDao)
    ];
    for (let extra of extras) {
      if (extra != null && extra !== '') {
        onSql = `${onSql} and ${extra}`;
      }
    }
    return `inner join ${newDao.getTableName()} on ${onSql}`;
  }

  /**
   * jointOpt 指定关联列。没有配置时返回 null，交给主键匹配。
   * other_item.other_item_id=stock_record.note_item_id
   */
  private buildJointOptSql(joinedDaos: Dao[], newDao: Dao): string {
    let jointOpt = this.param == null ? null : this.param.jointOpt;
    let item = this.findByTableName(jointOpt, newDao.getTableName());
    if (item == null || item.table1Col == null || item.table1Col === '' || item.table2Col == null || item.table2Col === '') {
      return null;
    }
    let oldDao = joinedDaos[joinedDaos.length - 1];
    let table1Col = this.parseDaoField(oldDao, item.table1Col);
    let table2Col = this.parseDaoField(newDao, item.table2Col);
    return `${newDao.getTableName()}.${table2Col}=${oldDao.getTableName()}.${table1Col}`;
  }

  /**
   * 已加入的最后一张表和新表上的 valueOpt，拼成 表.列=值。
   */
  private buildValueSql(joinedDaos: Dao[], newDao: Dao): string {
    let parts: string[] = [];
    this.appendValueSql(parts, joinedDaos[joinedDaos.length - 1]);
    this.appendValueSql(parts, newDao);
    if (parts.length == 0) {
      return null;
    }
    return parts.join(' and ');
  }

  private appendValueSql(parts: string[], dao: Dao) {
    if (dao == null) {
      return;
    }
    let valueOpt = this.param == null ? null : this.param.valueOpt;
    let item = this.findByTableName(valueOpt, dao.getTableName());
    if (item == null || item.col == null || item.col === '') {
      return;
    }
    let dbCol = this.parseDaoField(dao, item.col);
    parts.push(`${dao.getTableName()}.${dbCol}=${this.formatSqlValue(item.value)}`);
  }

  private formatSqlValue(value: any): string {
    if (value == null) {
      return 'null';
    }
    if (typeof value == 'number') {
      return String(value);
    }
    if (typeof value == 'boolean') {
      return value ? '1' : '0';
    }
    return `'${String(value).replace(/'/g, "''")}'`;
  }

  private parseDaoField(dao: Dao, field: string): string {
    let colChanger = dao.getColChanger();
    if (colChanger == null) {
      return field;
    }
    return colChanger.parsePojoField(field);
  }

  /**
   * 拼被 join 表上的附加条件。没有配置时返回 null。
   */
  private buildOtherSql(tableName: string): string {
    let item = this.findOtherSql(tableName);
    if (item == null) {
      return null;
    }
    let op = item.op;
    if (op == null || op === '') {
      op = '<>';
    }
    let table1Col = this.parseOtherCol(item.table1Col);
    let table2Col = this.parseOtherCol(item.table2Col);
    return `${table1Col}${op}${table2Col}`;
  }

  /**
   * 按表名取附加条件。key 可以是驼峰或下划线。
   */
  private findOtherSql(tableName: string): OtherSqlOpt {
    let otherSql = this.param == null ? null : this.param.otherSql;
    return this.findByTableName(otherSql, tableName);
  }

  /**
   * 按表名取配置。key 可以是驼峰或下划线。
   */
  private findByTableName<T>(map: { [tableName: string]: T }, tableName: string): T {
    if (map == null || tableName == null) {
      return null;
    }
    if (map[tableName] != null) {
      return map[tableName];
    }
    for (let key in map) {
      if (this.isSameTableName(key, tableName)) {
        return map[key];
      }
    }
    return null;
  }

  /**
   * salesRecord.bomCode 转成 sales_record.bom_code。
   * 表名找到对应 dao，列名走该 dao 的 colChanger。
   */
  private parseOtherCol(col: string): string {
    if (col == null || col.indexOf('.') == -1) {
      return col;
    }
    let index = col.indexOf('.');
    let tableName = col.substring(0, index);
    let field = col.substring(index + 1);
    let dao = this.findDaoByTableName(tableName);
    if (dao == null) {
      return col;
    }
    let colChanger = dao.getColChanger();
    let dbField = field;
    if (colChanger != null) {
      dbField = colChanger.parsePojoField(field);
    }
    return `${dao.getTableName()}.${dbField}`;
  }

  private findDaoByTableName(tableName: string): Dao {
    let daos = this.daos;
    if (daos == null) {
      return null;
    }
    for (let dao of daos) {
      if (this.isSameTableName(tableName, dao.getTableName())) {
        return dao;
      }
    }
    return null;
  }

  private isSameTableName(src: string, dest: string): boolean {
    if (src == dest) {
      return true;
    }
    return StrUtil.changeUnderStringToCamel(src) == StrUtil.changeUnderStringToCamel(dest);
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
