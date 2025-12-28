interface AssignOpt {
    /**
     * 被分配的值的属性
     */
    col: string;
    /**
     * 需要分配的值的属性
     */
    assignNumObjCol?: string;
    /**
     * 分配前乘以某个比例，分配后除以某个比例，例如金额单位为元，要分配到分，则改比例为100
     * */
    fee?: number;
}
interface NumAndUnit {
    /**
     * 数量
     */
    cnt: number;
    /**
     * 单位
     */
    name: string;
}
export default class {
    /**
     * 把类似“￥54.90”，“$10”,"10.01"等字符串转化成数字，上述返回分别是54.9， 10，10.01
     * @param str
     */
    static getNum(str: string): number;
    /**
     * 获取数字和单位，例如“23瓶500ml”变成[{num:23,unit:'瓶'},{num:500,unit:'ml'}]
     * @param str
     */
    static getNumAndUnit(str: string): NumAndUnit[];
    /**
     * 如果需要分配的值大于被分配对象的值，那么需要分配的值将按比例缩小，直到等于被分配对象的值
     * @param numObj 被分配的值
     * @param assignNumObjs 需要分配的值
     
     */
    static assign(numObj: any, assignNumObjs: any[], opt: AssignOpt): void;
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
export {};
