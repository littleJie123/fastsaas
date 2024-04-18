import AggFun from '../AggFun'

export default class AvgFun extends AggFun{
    protected _fun(): number {
        let sum = 0;
        if(this.list.length == 0)
            return 0;
        for(let obj of this.list){
            sum+=obj;
        }
        
        return sum/this.list.length;
    }
    clone(): AggFun {
        return new AvgFun();
    }
}