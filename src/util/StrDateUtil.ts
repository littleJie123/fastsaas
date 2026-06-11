import { AndCdt, BaseCdt } from "../fastsaas";
import { DateUtil } from "./DateUtil";

export default class {

  static isToday(date:string){
    if(date == null){
      return false;
    }
    return DateUtil.todayStr() == date;
  }

  /**
   * 返回时间部分 类似'00:00:00'
   * @param date 
   */
  static getTime(date:Date):string{
    let str = DateUtil.formatDate(date);
    return str.substring(11);
  }

  static between(colName: string, begin: string, end: string,opt?:{
    isTimeStamp?:boolean //是否是时间戳，默认false
  }): BaseCdt {
    let andCdt = new AndCdt();
    if (begin != null) {
      if(!opt?.isTimeStamp){
        andCdt.bigEq(colName, begin);
      }else{
        andCdt.bigEq(colName, DateUtil.parse(begin).getTime());
      }
    }
    if (end != null) {
      let endStr = this.add(end, 1);
      if(!opt?.isTimeStamp){
        andCdt.less(colName, endStr);
      }else{
        andCdt.less(colName, DateUtil.parse(endStr).getTime());
      }
    }
    return andCdt
  }
  static beforeDay(days?: number, today?: string) {
    if (days == null) {
      days = 1
    }
    if (today == null) {
      today = DateUtil.todayStr();
    }
    return this.add(today, days * -1);
  }
  static add(strDate: string, day: number): string {
    if (day == 0) {
      return strDate;
    }
    let date = DateUtil.parse(strDate);
    if (day > 0) {
      date = DateUtil.afterDay(date, day);
    }
    if (day < 0) {
      date = DateUtil.beforeDay(date, day * -1)
    }
    return DateUtil.format(date);
  }

  static getToday(): string {
    return DateUtil.format(new Date());
  }

  /**
   * 根据开始结束返回日期列表
   * @param begin 
   * @param end 
   * @returns 
   */
  static getDays(begin: string, end: string): string[] {
    let ret: string[] = [];
    while (begin <= end) {
      ret.push(begin);
      begin = this.add(begin, 1)
    }
    return ret;
  }
}