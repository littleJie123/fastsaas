import { DateUtil } from "./DateUtil";

export default class{
  static add(strDate:string,day:number):string{
    if(day == 0){
      return strDate;
    }
    let date = DateUtil.parse(strDate);
    if(day>0){
      date = DateUtil.afterDay(date,day);
    }
    if(day<0){
      date = DateUtil.beforeDay(date,day*-1)
    }
    return DateUtil.format(date);
  }

  static getToday():string{
    return DateUtil.format(new Date());
  }

  /**
   * 根据开始结束返回日期列表
   * @param begin 
   * @param end 
   * @returns 
   */
  static getDays(begin:string,end:string):string[]{
    let ret:string[] = [];
    while(begin<=end){
      ret.push(begin);
      begin = this.add(end,1)
    }
    return ret;
  }
}