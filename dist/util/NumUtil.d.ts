export default class {
    /**
     * 能否整除
     * @param num1
     * @param num2
     * @returns
     */
    static isDivisible(num1: number, num2: number): boolean;
    /**
     * 计算两个数的最大公约数
     * @param a 第一个数
     * @param b 第二个数
     * @returns 最大公约数
     */
    static gcd(a: number, b: number): number;
    /**
     * 计算两个数的最小公倍数
     * @param a 第一个数
     * @param b 第二个数
     * @returns 最小公倍数
     */
    static lcm(a: number, b: number): number;
    static add(...nums: number[]): number;
    static isEq(num1: number, num2: number): boolean;
    /**
     * 保留几位小数,默认2位
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
