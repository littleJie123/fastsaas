import AggFun from '../AggFun';
export default class AvgFun extends AggFun {
    protected _fun(): number;
    clone(): AggFun;
}
