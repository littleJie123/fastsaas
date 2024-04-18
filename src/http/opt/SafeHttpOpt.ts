import TimeOpt from "../../wiget/TimeOpt";

export default interface SafeHttpOpt extends TimeOpt{
    /**
     * 接口超时时间，默认5秒
     */
    timeout?:number;
    /**
     * 阈值，当堵塞/超时/出错的接口数大于这个值，触发熔断
     */
    thresh?:number;
}