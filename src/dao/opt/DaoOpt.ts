import IDaoOpt from "../../inf/IDaoOpt";
import ColChanger from "../colChanger/ColChanger";

export default class DaoOpt{
	
  
  _opt:IDaoOpt;
  constructor(opt:IDaoOpt){
    
    if(opt==null)
      opt = <IDaoOpt>{};
    opt = {... opt}
    if(opt.colChanger == null && opt.Pojo != null){
      let Pojo = opt.Pojo;
      let dbToPojoMap = Pojo.prototype?.__dbToPojoMap
      if(dbToPojoMap)
        opt.colChanger = new ColChanger(dbToPojoMap,Pojo)
    }
    this._opt = opt;
  }

  /**
   * 将内存中的字段转成db的字段
   * @param pojoField  内存中的字段
   */
  parsePojoFieldsToDbFields(pojoField: string[]): string[] {
    if(this._opt.colChanger == null){
      return pojoField;
    }
    return this._opt.colChanger.parsePojoFieldsToDbFields(pojoField)
  }
  /**
   * 将一个内存的字段转成pos的字段
   * @param pojoField 内存的字段 
   */
  parsePojoField(pojoField: string): string   {
		if(this._opt.colChanger == null){
      return pojoField;
    }
    return this._opt.colChanger.parsePojoField(pojoField)
	}
	/**
	 * 返回列的转换器
	 * @returns 
	 */
	getColChanger(){
		return this._opt.colChanger;
	}
  /**
   * 返回表名
   */
  getTableName():string{
    return this._opt.tableName
  }

  /**
   * @returns poolName
   */
  getPoolName(): string {
    return this._opt.poolName
  }
  getIds():string[]{
    return this._opt.ids;
  }
  /**
   * 返回id列表
   */
  acqIds():Array<string>{
    var opt = this._opt;
    if(opt.ids == null)
      return ['id'];
    var ids = opt.ids;
    if(!(ids instanceof Array))
      ids = [ids];
    return ids;
  }
  /**
   * 是否 id[可以兼容判断内存和db的字段]
   * @param col 
   */
  isId(col:string):boolean{
    var ids = this.acqIds();
    for(var id of ids){
      if(col == id)
        return true;
      let colChanger = this._opt.colChanger;
      if(colChanger != null){
        let dbField = colChanger.parsePojoField(col);
        if(dbField == id){
          return true;
        }
      }
    }
    return false;
  }
  /**
   * 是否自增
   */
  isIncrement():boolean{
    var opt = this._opt;
    return opt.increment == null || opt.increment == true;
  }
  /**
   * 返回首个数据库id
   */
  acqFirstId():string{
    var ids = this.acqIds();
    return ids[0]
  }

  /**
   * 返回首个内存中的pojo id
   */
  acqPojoFirstId():string{
    return this.parseDbField(this.acqFirstId())
  }
  /**
   * 将db的字段变成pojo的字段
   * @param col 
   */
  parseDbField(col:string):string{
    if(this._opt.colChanger == null)
      return col;
    return this._opt.colChanger.parseDbField(col);
  }
}