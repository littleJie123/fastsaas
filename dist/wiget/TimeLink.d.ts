import TimeObj from "./TimeObj";
import TimeOpt from "./TimeOpt";
/**
 * 一个时间有序的双向列表
 */
export default class TimeLink<T = any> {
    private tail;
    private opt;
    constructor(opt?: TimeOpt);
    /**
     * 往时间队列里面加对象
     * @param obj 增加的对象
     * @param fun 相同时间id，对老的数据进行处理
     */
    add(obj: T, fun: (oldObj: T, newObj: T) => T): TimeObj<T>;
    private link;
    private createObj;
    private getTail;
    private isValid;
    getTimeId(timestamp?: number): number;
    /**
     * 返回过期时间
     * @returns
     */
    private getExpire;
    /**
     * 返回时间步长
     * @returns
     */
    private getTimeStep;
    /**
     * 切断没有用的节点
     * @param timeObj
     */
    private cut;
    get(): T[];
}
