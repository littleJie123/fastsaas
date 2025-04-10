interface MapNameOpt{
  col:string;
  map:any;
  fun?(data:any,value:any):void;
}
export default class MapNameHat{
  private opt:MapNameOpt;
  constructor(opt:MapNameOpt){
    this.opt = opt;
  }
  process(list:any[]){
    for(let row of list){
      let value = this.opt.map[row[this.opt.col]];
      if(this.opt.fun){
        this.opt.fun(row,value)
      }else{
        row[this.opt.col+'Name'] = value;
      }
    }
  }
}