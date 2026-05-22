import { BaseCdt } from "../fastsaas";
export default class {
    static between(colName: string, begin: string, end: string, opt?: {
        isTimeStamp?: boolean;
    }): BaseCdt;
    static beforeDay(days?: number, today?: string): string;
    static add(strDate: string, day: number): string;
    static getToday(): string;
    /**
     * 根据开始结束返回日期列表
     * @param begin
     * @param end
     * @returns
     */
    static getDays(begin: string, end: string): string[];
}
