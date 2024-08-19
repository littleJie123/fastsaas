import AggFun from '../AggFun';
export default class SumFun extends AggFun {
    clone(): AggFun;
    protected _fun(): number;
}
