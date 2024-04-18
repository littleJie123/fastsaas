import TimeLink from "./TimeLink";
import TimeObj from "./TimeObj";
import TimeOpt from "./TimeOpt";

/**
 * 一个数据结构，记录按时间保存的次数，在空间复杂度和时间复杂度上做的最好
 */
export default class TimeCnt{
    private timeLink:TimeLink<number>;
    constructor(opt?:TimeOpt){
        this.timeLink = new TimeLink<number>(opt);
    }

    /**
     * 增加数量
     * @param n 
     */
    add(n?:number):TimeObj<number>{
        if(n==null)
            n=1;
        return this.timeLink.add(n,(n1:number,n2:number)=>n1+n2);
    }

    get(){
        let sum = 0;
        let datas = this.timeLink.get();
        for(let data of datas){
            sum += data
        }
        return sum;
    }
}