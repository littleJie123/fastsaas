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
}