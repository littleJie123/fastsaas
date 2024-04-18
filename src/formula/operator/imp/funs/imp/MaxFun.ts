import AggFun from '../AggFun'

export default class MaxFun extends AggFun{
    clone(): AggFun {
        return new MaxFun();
    }
    protected _fun(): number {
        let sum = null;
        for(let obj of this.list){
            if(sum==null || obj>sum)
                sum = obj;
        }
        return sum;
    }
    
}