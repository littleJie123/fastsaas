interface ILoadOpt{
  tables?:{[loadKey:string]:string}
}

export default interface IDomainOpt<Pojo=any> {
  schQuery?:any;
  cols?:string[];
  onBeforeLoad?(pojos:Pojo[]):Promise<void>;
  /**
   * 比较
   * @param dbData 数据库数据
   * @param data 内存数据
   */
  onCompare?(dbData:Pojo,data:Pojo);

  /**
   * 根据数据中的id去其他表进行加载
   */
  loadKeys?:string[];

  table?:string;

  loadOpt?:ILoadOpt;



}