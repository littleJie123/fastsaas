export declare class DateUtil {
    private static _dayTimes;
    /**
     * @description 将 类似2015-04-16T03:38:12，2015-04-16 的字符串转化成Date对象
     * @param  {[type]} str [description]
     * @return {[type]}	 [description]
     */
    static parse(str: any): Date;
    static formatList(list: Array<any>, col: any): void;
    static format(date: any): string;
    static formatDate(date: any): string;
    private static formatNum;
    static afterDay(date: any, days: number): Date;
    static beforeDay(date: any, days: number): Date;
    static afterMonth(date: any, n: number): Date;
    /**
     前面几个月
     */
    static beforeMonth(date: any, n: number): Date;
    /**
     * 查询今天
     * @returns
     */
    static today(): Date;
    static todayStr(): string;
    static monthFirst(): Date;
    static onlyDate(d: Date): Date;
    /**
     * 计算相差的天数 date1-date2
     * @param date1
     * @param date2
     * @returns
     */
    static calDate(date1: Date, date2: Date): number;
}
