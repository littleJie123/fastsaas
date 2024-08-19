import AggFun from '../AggFun';
export default class MaxFun extends AggFun {
    clone(): AggFun;
    protected _fun(): number;
}
