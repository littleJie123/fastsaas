import Context from './../context/Context';
import BaseHatOpt from './BaseHatOpt';
export default abstract class BaseHat {
    protected _opt: BaseHatOpt;
    protected _fun: (data: any, hatData: any) => Promise<void> | void;
    constructor(opt: BaseHatOpt);
    abstract process(list: Array<any>): Promise<Array<any>>;
    protected getContext(): Context;
    processOne(row: any): Promise<any>;
}
