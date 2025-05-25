export default interface ISaveParam<Do>{
  datas:Do[];  
  /**
   * 检查的查询条件
   */
  query:any;

 
  /**
   * 这个开关表示是否需要删除
   */
  needDel?:boolean;

  needUpdate?:boolean;

  
}