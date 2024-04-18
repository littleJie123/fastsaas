import AggFun from '../AggFun'

export default class SumFun extends AggFun{
    clone(): AggFun {
        return new SumFun()
    }
    protected _fun(): number {
        let sum = 0;
        for(let obj of this.list){
            sum+=obj;
        }
        return sum;
    }
    
}