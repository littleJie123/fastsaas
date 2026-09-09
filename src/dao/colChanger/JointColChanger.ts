import ColChanger from "./ColChanger";
import Dao from "../Dao";
import { StrUtil } from "../../util/StrUtil";

interface JointColParam{
  daos:Dao[]
}
/**
 * 联合查询的字段转换器
 * 将 pojo 字段转成 tableName.dbField
 */
export default class JointColChanger extends ColChanger {
  private jointDaoOpt: JointColParam;

  constructor(opt: JointColParam) {
    super({});
    this.jointDaoOpt = opt;
  }

  /**
   * 将一个内存字段转成 db 字段，并带上所在表名
   * @param pojoField 内存中的字段
   */
  parsePojoField(pojoField: string): string {
    let daos = this.jointDaoOpt?.daos;
    if(daos == null){
      return pojoField
    }
    if (pojoField.indexOf('.') != -1) {
      return this.parseTablePojoField(daos, pojoField);
    }
    return this.parsePlainPojoField(daos, pojoField);
  }

  /**
   * 已带表名：从同名表的 dao 中查 pojoFields
   */
  private parseTablePojoField(daos: Dao[], pojoField: string): string {
    let index = pojoField.indexOf('.');
    let tableName = pojoField.substring(0, index);
    let field = pojoField.substring(index + 1);
    let dao = this.findDaoByTableName(daos, tableName);
    if (dao == null) {
      return pojoField;
    }
    if (!this.hasPojoField(dao, field)) {
      return pojoField;
    }
    return this.toTableDbField(dao, field);
  }

  /**
   * 未带表名：按 daos 顺序命中第一个
   */
  private parsePlainPojoField(daos: Dao[], pojoField: string): string {
    for (let dao of daos) {
      if (this.hasPojoField(dao, pojoField)) {
        return this.toTableDbField(dao, pojoField);
      }
    }
    return pojoField;
  }

  private findDaoByTableName(daos: Dao[], tableName: string): Dao {
    for (let dao of daos) {
      if (this.isSameTableName(tableName, dao.getTableName())) {
        return dao;
      }
    }
    return null;
  }

  /**
   * 表名相同，兼容驼峰和下划线
   */
  private isSameTableName(src: string, dest: string): boolean {
    if (src == dest) {
      return true;
    }
    return StrUtil.changeUnderStringToCamel(src) == StrUtil.changeUnderStringToCamel(dest);
  }

  private hasPojoField(dao: Dao, field: string): boolean {
    return dao.getPojoCols().indexOf(field) != -1;
  }

  private toTableDbField(dao: Dao, field: string): string {
    let dbField = dao.getColChanger().parsePojoField(field);
    return `${dao.getTableName()}.${dbField}`;
  }

  /**
   * 查询结果转成内存对象
   * 无表名：遍历 daos 转字段名
   * 有表名：挂到对应表的嵌套对象上
   */
  changeDb2Pojo(data) {
    if (data == null) {
      return null;
    }
    let daos = this.jointDaoOpt?.daos;
    if (daos == null) {
      return data;
    }
    let ret: any = {};
    for (let col in data) {
      this.putDbValue(ret, daos, col, data[col]);
    }
    return ret;
  }

  private putDbValue(ret: any, daos: Dao[], col: string, value: any) {
    if (col.indexOf('.') != -1) {
      this.putTableDbValue(ret, daos, col, value);
      return;
    }
    this.putPlainDbValue(ret, daos, col, value);
  }

  /**
   * inventory.inventory_day -> { inventory: { inventoryDay } }
   */
  private putTableDbValue(ret: any, daos: Dao[], col: string, value: any) {
    let index = col.indexOf('.');
    let tableName = col.substring(0, index);
    let dbField = col.substring(index + 1);
    let dao = this.findDaoByTableName(daos, tableName);
    let colChanger = dao?.getColChanger();
    if (dao == null || colChanger == null) {
      ret[col] = value;
      return;
    }
    let pojoField = colChanger.parseDbField(dbField);
    let nestKey = this.toPojoTableName(dao.getTableName());
    this.setNestValue(ret, nestKey, pojoField, value);
  }

  /**
   * 无表名：遍历 dao 的 dbFields 做字段名转化
   */
  private putPlainDbValue(ret: any, daos: Dao[], col: string, value: any) {
    for (let dao of daos) {
      if (this.hasDbField(dao, col)) {
        let pojoField = dao.getColChanger().parseDbField(col);
        ret[pojoField] = value;
        return;
      }
    }
    ret[col] = value;
  }

  private setNestValue(ret: any, nestKey: string, field: string, value: any) {
    if (ret[nestKey] == null) {
      ret[nestKey] = {};
    }
    ret[nestKey][field] = value;
  }

  private toPojoTableName(tableName: string): string {
    return StrUtil.changeUnderStringToCamel(tableName);
  }

  private hasDbField(dao: Dao, dbField: string): boolean {
    return this.getDbFields(dao).indexOf(dbField) != -1;
  }

  private getDbFields(dao: Dao): string[] {
    let colChanger = dao.getColChanger();
    if (colChanger == null) {
      return [];
    }
    return colChanger.parsePojoFieldsToDbFields(dao.getPojoCols());
  }
}