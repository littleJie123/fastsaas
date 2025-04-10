import { Context, DaoHelper } from "../fastsaas";
import { ISchCdt } from "./DaoHelper";
import fs from 'fs';
import path from "path";

interface BackUpResult{
  list:any[];
  schCdt:ISchCdt;
  tableName:string;
}
interface TableBackUpOpt{
  tableName:string;
  schCdt?:ISchCdt;
  builder?:SchCdtBuilder;
}
type SchCdtBuilder = (lastResult:BackUpResult)=>ISchCdt;

export class TableBackUp{
  private opt:TableBackUpOpt;
  private dataBakup:DataBakup; 
  context:Context;

  setDataBakup(dataBakup:DataBakup){
    this.dataBakup = dataBakup;
  }
  setContext(context:Context){
    this.context = context;
  }
  constructor(opt:TableBackUpOpt){
    this.opt = opt;
  }

  getTableName(){
    return this.opt.tableName;
  }

  async exportJson(lastResult:BackUpResult):Promise<BackUpResult>{
    let daoHelper = new DaoHelper({context:this.context});
    let schCdt = this.getSchCdt(lastResult)
    let tableName = this.opt.tableName;
    return {
      list:await daoHelper.findBySchCdt(tableName,schCdt),
      schCdt,
      tableName
    }
  }

  getSchCdt(lastResult:BackUpResult){
    if( this.opt.builder != null){
      return this.opt.builder(lastResult);
    }
    if(this.opt.schCdt){
      return this.opt.schCdt;
    }else{
      let schCdt = this.dataBakup.getSchCdt();
      if(schCdt == null){
        throw new Error(`${this.opt.tableName}没有设置schCdt`);
      }
      return schCdt;
    }
  }
}

interface DataBakupOpt{
  schCdt?:ISchCdt;
  context:Context;
  fileName:string;

}

/**
 * 数据备份
 */
export default class DataBakup {
  private opt:DataBakupOpt;
  private tableBackUps:TableBackUp[] = [];

  constructor(opt:DataBakupOpt){
    this.opt = opt;
  }
  getSchCdt():ISchCdt{
    return this.opt.schCdt;
  }

  add(tableName:string,builder?:SchCdtBuilder){
     
    let tableBackUp = new TableBackUp({
      tableName ,
      builder
    })
    this.addTableBackUp(tableBackUp);
  }

  addTableBackUp(tableBackUp:TableBackUp){
    tableBackUp.setDataBakup(this);
    tableBackUp.setContext(this.opt.context);
    this.tableBackUps.push(tableBackUp);
  }

  async backup(){
    let ret:any[]= [];
    let daoHelper = new DaoHelper({context:this.opt.context});
    let fileName = this.opt.fileName;
    daoHelper.backupFile(fileName);
    let lastResult:BackUpResult = null;
    for(let tableBackUp of this.tableBackUps){
      lastResult = await tableBackUp.exportJson(lastResult);
      ret.push(lastResult);
    }
    if(!fs.existsSync(fileName)){
      //写一段代码，如果上述目录不存在则创建目录
      let dir = path.dirname(fileName);
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    fs.writeFileSync(fileName,JSON.stringify(ret,null,2));
  }

  async restore(){
    let daoHelper = new DaoHelper({context:this.opt.context});
    let fileName = this.opt.fileName;
    let ret = JSON.parse(fs.readFileSync(fileName).toString());
    for(let item of ret){
      await daoHelper.importJsonData(item.tableName,item);
    }
  }
}