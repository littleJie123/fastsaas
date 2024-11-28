export default class {
    static isEq(num1: number, num2: number): boolean;
    /**
     * 保留几位小数
     * @param num
     * @param n
     * @returns
     */
    static toNum(num: number, n?: number): number;
    static format(num: number, len: number): string;
    /**
     * 判断是否数字
     * @param num
     */
    static isNum(num: any): boolean;
    /**
     * 是否含有小数
     * @param num
     */
    static isDecimal(num: number): boolean;
}
