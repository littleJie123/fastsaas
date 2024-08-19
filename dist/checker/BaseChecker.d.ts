import Context from './../context/Context';
import IChecker from '../control/inf/IChecker';
export default abstract class BaseChecker implements IChecker {
    protected _opt: any;
    constructor(opt: any);
    _initOpt(opt: any): any;
    protected getCode(): any;
    throwError(param?: any): Promise<void>;
    getContext(): Context;
    abstract check(param: any): Promise<any>;
}
