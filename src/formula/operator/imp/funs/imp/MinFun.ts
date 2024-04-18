import AggFun from '../AggFun'

export default class MinFun extends AggFun{
    clone(): AggFun {
        return new MinFun();
    }
    protected _fun(): number {
        let sum = null;
        for(let obj of this.list){
            if(sum==null || obj<sum)
                sum = obj;
        }
        return sum;
    }
    
}