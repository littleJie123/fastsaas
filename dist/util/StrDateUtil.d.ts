export default class {
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
