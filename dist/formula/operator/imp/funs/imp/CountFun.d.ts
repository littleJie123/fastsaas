import AggFun from '../AggFun';
export default class CountFun extends AggFun {
    noEsEgg: boolean;
    backetPath: string;
    protected _fun(array: any): number;
    clone(): AggFun;
}
