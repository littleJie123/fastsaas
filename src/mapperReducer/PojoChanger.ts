export default class PojoChanger<Pojo=any>{
  oldPojo:Pojo;
  newPojo:Pojo;
  constructor(oldPojo:Pojo,newPojo:Pojo){
    this.oldPojo = oldPojo;
    this.newPojo = newPojo;
  }

  getChangeValue(key:string):number{
    return (this.newPojo[key] ?? 0)  - (this.oldPojo[key] ?? 0);
  }

  static sum(list:PojoChanger[],key:string):number{
    let sum = 0;
    for(let row of list){
      sum + row.getChangeValue(key)
    }
    return sum;
  }

  static sumObj(list:PojoChanger[],keys:string[]):any{
    let sum = {};
    for(let key of keys){
      sum[key ] = 0
    }
    for(let row of list){
      for(let key of keys){
        sum[key] += row.getChangeValue(key);
      }
    }
    return sum;
  }
}