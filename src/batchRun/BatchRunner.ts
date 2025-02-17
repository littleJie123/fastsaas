import { Context, Dao, Query } from "../fastsaas";

interface ProcessResult {
  stop?:boolean
}
interface Opt<Pojo = any>{
  context?:Context;
  pageSize?:number;
  tableName?:string;
  col?:string
  query?:any;
  colArray?:string[]
  process?(list:Pojo[]):Promise<ProcessResult|void>;
}
/**
 * 批量运行
 */
export default class BatchRunner<Pojo = any>{
  private opt:Opt<Pojo>;

  constructor(opt:Opt<Pojo>){
    this.opt = {
      ... this.getInit(),
      ... opt
    }
  }
  protected getInit():Opt<Pojo>{
    return {
      pageSize:1000,
      query:{}
    }
  }
  private isOver(list:any[]){
    if(list == null){
      return false;
    }
    return list.length < this.opt.pageSize;
  }
  async process(){
    let list:Pojo[] = null;
    let cnt = 0;
    while(!this.isOver(list)){
      list = await this.findList(list)
      if(list.length > 0){
        let result:any = await this.doProcess(list);
        cnt += list.length;
        let col = this.getCol()
        console.log(`已经处理${this.opt.tableName} ${cnt}条记录`);
        console.log(`最后一条记录的id为${list[list.length-1][col]}`);
        if(result?.stop){
          console.log(`====================${this.opt.tableName}处理完成 =============================`)
          return;
        }
        
      }
    }
    console.log(`====================${this.opt.tableName}处理完成 =============================`)
  }

  protected async doProcess(list:Pojo[]){
    
    return this.opt.process(list);
  }


  protected async findList(list:any[]):Promise<any[]>{
    let query:Query = this.buildQuery();
    let col = this.getCol();
    if(list != null && list.length>0){
      
      query.big(col,list[list.length-1][col])
    }
    return this.getDao().find(query);
  }

  protected getDao():Dao{
    return this.opt.context.get(this.opt.tableName+ 'Dao')
  }

  protected buildQuery():Query{
    let query = new Query(this.opt.query);
    if(this.opt.colArray != null){
      query.col(this.opt.colArray)
    }
    query.size(this.opt.pageSize)
    let col = this.getCol();
    query.order(col)
    return query;
  }
  protected getCol():string{
    let col = this.opt.col;
    if(col == null){
      col = this.opt.tableName + 'Id'
    }
    return col;
  }
}
