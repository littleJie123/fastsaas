import AggFun from '../AggFun'

export default class CountFun extends AggFun{
    noEsEgg:boolean = true;
    backetPath:string =  '_count';
    protected _fun(array): number {
        return array.length
    }

    clone(): AggFun {
        return new CountFun();
    }
    
}