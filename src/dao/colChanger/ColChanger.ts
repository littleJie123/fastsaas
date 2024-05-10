import SqlToken from "./sqlToken/SqlToken";
import SqlTokenFac from "./sqlToken/SqlTokenFac";

export default class {
  
  
  
  private dbToPojoMap:{[key:string]:string};
  private pojoToDbMap:{[key:string]:string};
  private clazz:any;
  /**
   * 一个db的field为key，pojo属性为value的map
   * @param dbToPojoMap 
   */
  constructor(dbToPojoMap:{[key:string]:string},clazz?:any){
    this.clazz = clazz;
    this.dbToPojoMap = dbToPojoMap;;
    let pojoToDbMap = {};
    for(let e in dbToPojoMap){
      pojoToDbMap[dbToPojoMap[e]] = e
    }
    this.pojoToDbMap = pojoToDbMap;
  }

  /**
   * 是否有效的key
   * @param col 
   */
  isValid(col: string):boolean {
    return this.pojoToDbMap[col] != null;
  }
  /**
   * 将db的字段转成pojo的字段
   * @param col 
   * @returns 
   */
  parseDbField(col: string): string {
    let ret = this.dbToPojoMap[col];
    if(ret != null) 
      return ret;
    return col;
  }
  /**
   * 将一个内存字段转成db中的字段
   * @param pojoField 内存中的字段
   */
  parsePojoField(pojoField:string){
    let pojoToDbMap = this.pojoToDbMap;
    let dbField = pojoToDbMap[pojoField];
    if(dbField == null)
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
    for(let field of pojoFields){
      if(pojoToDbMap[field] != null){
        ret.push(pojoToDbMap[field])
      }else{
        ret.push(field);
      }
    }
    return ret;
  }

  /**
   * 把一个字段为pojo属性的sql ，转成数据库的sql
   */
  changeSql(sql:string):string{
    let sqlTokens:SqlToken[] = this.scanTokens(sql)
    let sqls = sqlTokens.map(token=>token.change(this.pojoToDbMap));
    return sqls.join('')
  }
  scanTokens(sql: string): SqlToken[] {
    let i = 0;
    let token:SqlToken = null;
    let ret:SqlToken[] = [];
    while(i<sql.length){
      let c = sql.charAt(i);
      if(token == null){
        token = SqlTokenFac.hit(c);
        
        token.add(c);
        ret.push(token)
      }else{
        if(token.isEnd(c)){
           
          token = SqlTokenFac.hit(c);
          
          ret.push(token)
        }
        token.add(c);
      }
      i++;
    }
    return ret;
  }
   
  /**
   * 把从db里面查询出来的对象转成内存
   */
  changeDb2Pojo(data){
    if(data == null)
      return null;
    let ret:any = null;
    let clazz = this.clazz;
    if(clazz == null){
      ret = {};
    }else{
      ret = new clazz();
    }
    let db2PojoMap = this.dbToPojoMap;
    for(let e in data){
      if(db2PojoMap[e] != null){
        ret[db2PojoMap[e]] = data[e]
      }else{
        ret[e] = data[e]
      }
    }
    return ret;
  }
  /**
   * 将一个数组的数据库对象转成内存的数组
   */
  changeDbArray2Pojo(array:any[]){
    return array.map(row=>this.changeDb2Pojo(row));
  }


}