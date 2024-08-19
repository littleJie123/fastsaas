import AggFun from '../AggFun';
export default class MinFun extends AggFun {
    clone(): AggFun;
    protected _fun(): number;
}
