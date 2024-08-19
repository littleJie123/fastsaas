import TimeObj from "./TimeObj";
import TimeOpt from "./TimeOpt";
/**
 * 一个数据结构，记录按时间保存的次数，在空间复杂度和时间复杂度上做的最好
 */
export default class TimeCnt {
    private timeLink;
    constructor(opt?: TimeOpt);
    /**
     * 增加数量
     * @param n
     */
    add(n?: number): TimeObj<number>;
    get(): number;
}
