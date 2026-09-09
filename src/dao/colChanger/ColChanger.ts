import SqlToken from "./sqlToken/SqlToken";
import SqlTokenFac from "./sqlToken/SqlTokenFac";
import IColChanger from "./IColChanger";

export default class ColChanger implements IColChanger {
  private dbToPojoMap: { [key: string]: string };
  private pojoToDbMap: { [key: string]: string };
  private clazz: any;

  /**
   * 一个db的field为key，pojo属性为value的map
   * @param dbToPojoMap 
   */
  constructor(dbToPojoMap: { [key: string]: string }, clazz?: any) {
    this.clazz = clazz;
    this.dbToPojoMap = dbToPojoMap;
    let pojoToDbMap = {};
    for (let e in dbToPojoMap) {
      pojoToDbMap[dbToPojoMap[e]] = e;
    }
    this.pojoToDbMap = pojoToDbMap;
  }

  /**
   * 是否有效的key
   * @param col 
   */
  isValid(col: string): boolean {
    return this.pojoToDbMap[col] != null;
  }

  /**
   * 返回所有 pojo 字段（驼峰）
   */
  getPojoCols(): string[] {
    return Object.keys(this.pojoToDbMap);
  }

  /**
   * 将db的字段转成pojo的字段
   * @param col 
   * @returns 
   */
  parseDbField(col: string): string {
    let ret = this.dbToPojoMap[col];
    if (ret != null)
      return ret;
    return col;
  }

  /**
   * 将一个内存字段转成db中的字段
   * @param pojoField 内存中的字段
   */
  parsePojoField(pojoField: string) {
    let index = pojoField.indexOf('.');
    if (index != -1) {
      let start = pojoField.substring(0, index);
      let end = pojoField.substring(index + 1);
      let dbField = this.pojoToDbMap[end];
      if (dbField == null) {
        return pojoField;
      }
      return `${start}.${dbField}`;
    }
    let pojoToDbMap = this.pojoToDbMap;
    let dbField = pojoToDbMap[pojoField];
    if (dbField == null)
      return pojoField;
    return dbField;
  }

  /**
   * 将内存的字段数组转成db的字段
   * @param pojoFields 内存中的字段
   */
  parsePojoFieldsToDbFields(pojoFields: string[]): string[] {
    let ret = [];
    let pojoToDbMap = this.pojoToDbMap;
    for (let field of pojoFields) {
      if (pojoToDbMap[field] != null) {
        ret.push(pojoToDbMap[field]);
      } else {
        ret.push(field);
      }
    }
    return ret;
  }

  /**
   * 把一个字段为pojo属性的sql ，转成数据库的sql
   */
  changeSql(sql: string): string {
    let sqlTokens: SqlToken[] = this.scanTokens(sql);
    let sqls = [];
    for (let i = 0; i < sqlTokens.length; i++) {
      let tableFieldSql = this.changeTableField(sqlTokens, i);
      if (tableFieldSql != null) {
        sqls.push(tableFieldSql);
        i = i + 2;
        continue;
      }
      sqls.push(this.changeToken(sqlTokens[i]));
    }
    return sqls.join('');
  }

  /**
   * 把 table.field 整段交给 parsePojoField
   */
  private changeTableField(tokens: SqlToken[], i: number): string {
    let left = tokens[i];
    let dot = tokens[i + 1];
    let right = tokens[i + 2];
    if (left == null || dot == null || right == null) {
      return null;
    }
    if (!left.needChange() || !right.needChange()) {
      return null;
    }
    if (dot.toSql() != '.') {
      return null;
    }
    let table = left.getField();
    let field = right.getField();
    if (table == null || field == null) {
      return null;
    }
    return this.parsePojoField(`${table}.${field}`);
  }

  /**
   * 将单个 token 转成 sql
   * @param token 
   */
  private changeToken(token: SqlToken): string {
    if (!token.needChange()) {
      return token.toSql();
    }
    let field = token.getField();
    if (field == null) {
      return token.toSql();
    }
    let dbField = this.parsePojoField(field);
    return token.changeByDbField(dbField);
  }

  /**
   * 把从db里面查询出来的对象转成内存
   */
  changeDb2Pojo(data) {
    if (data == null)
      return null;
    let ret: any = null;
    let clazz = this.clazz;
    if (clazz == null) {
      ret = {};
    } else {
      ret = new clazz();
    }
    let db2PojoMap = this.dbToPojoMap;
    for (let e in data) {
      if (db2PojoMap[e] != null) {
        ret[db2PojoMap[e]] = data[e];
      } else {
        ret[e] = data[e];
      }
    }
    return ret;
  }

  /**
   * 将一个数组的数据库对象转成内存的数组
   */
  changeDbArray2Pojo(array: any[]) {
    return array.map(row => this.changeDb2Pojo(row));
  }

  private scanTokens(sql: string): SqlToken[] {
    let i = 0;
    let token: SqlToken = null;
    let ret: SqlToken[] = [];
    while (i < sql.length) {
      let c = sql.charAt(i);
      if (token == null) {
        token = SqlTokenFac.hit(c);

        token.add(c);
        ret.push(token);
      } else {
        if (token.isEnd(c)) {
          token = SqlTokenFac.hit(c);
          ret.push(token);
        }
        token.add(c);
      }
      i++;
    }
    return ret;
  }
}
