/**
 * 时间队列的
 */
export default interface TimeOpt {
    /**
     * 过期时间
     */
    expire?:number;
    /**
     * 时间储存的精度
     */
    timestep?:number;
}