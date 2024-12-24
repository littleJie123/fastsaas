import { ArrayUtil, IGeter } from "../fastsaas";

export default class Mapper<Pojo = any>{
  private mapper:any = {}
  constructor(datas:Pojo[],keys:IGeter[]){
    this.init(datas,this.mapper,keys,0);
  }

  private init(datas:Pojo[],map:any,keys:IGeter[],index:number){
    let self = this;
    let key = keys[index];
    ArrayUtil.groupBy({
      list:datas,
      key:key,
      fun(array:Pojo[],e){
        if(index >= keys.length-1){
          map[e] = array;
        }else{
          map[e] = {}
          self.init(array,map[e],keys,index+1)
        }
      }
    })
  }

  get(keys:string[]):Pojo[]{
    let map = this.mapper;
    for(let i = 0;i<keys.length;i++){
      if(i == keys.length-1){
        return this.getArrayFromMap(map[keys[i]]);
      }else{
        map = map [keys[i]]
        if(map == null){
          return null;
        }
      }
    }
  }

  private getArrayFromMap(mapArray:any):Pojo[]{
    if(mapArray == null){
      return null;
    }
    if(mapArray instanceof Array){
      return mapArray;
    }
    let ret:Pojo[] = []
    this.doGetArrayFromMap(mapArray,ret)
    return ret;
  }
  private doGetArrayFromMap(mapArray: any, ret: Pojo[]) {
    for(let e in mapArray){
      let datas = mapArray[e]
      if(datas instanceof Array){
        ret.push(... datas)
      }else{
        this.doGetArrayFromMap(datas,ret);
      }
    }
  }

  




}