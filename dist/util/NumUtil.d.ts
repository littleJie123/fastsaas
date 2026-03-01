interface ShareCostOpt {
    /**
     * 分配前乘以某个比例，分配后除以某个比例，例如金额单位为元，要分配到分，则改比例为100
     * */
    fee?: number;
}
interface AvgOpt {
    /**
     * 分配前乘以某个比例，分配后除以某个比例，例如金额单位为元，要分配到分，则改比例为100
     * */
    fee?: number;
}
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
    /**
     * 计算比例的值
     */
    valueCol?: string;
    /**
     * 如果需要分配的值大于分配的值，则不分配保持原值
     */
    ifBigNoAssign?: boolean;
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
     * 将一个数平均分配到多个对象中
     * @param sumValue
     * @param cnt
     * @param avgOpt
     */
    static avg(sumValue: number, cnt: number, avgOpt?: AvgOpt): number[];
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
     * 分别负担。例如多个账户负担一笔支出。
     * 如果账户的余额总和小于支出，则支出全部余额。
     * 如果总和大于支出，则按比例分配。剩余的再依次扣减
     * @param cost 支出
     * @param shareCosts 账户余额
     * @param opt
     */
    static shareCost(cost: number, shareCosts: number[], opt?: ShareCostOpt): number[];
    /**
     * 把一个大的，按比例分配给小的。类似10个苹果 ，5个人分。如果每个人需要的量加起来小于10个，则按需求量分配。如果大于，则按比例进行分配。
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
     * 判断是不是数字，包括可以转化成数字的字符串
     */
    static isNumber(num: any): boolean;
    /**
     * 是否含有小数
     * @param num
     */
    static isDecimal(num: number): boolean;
}
export {};
