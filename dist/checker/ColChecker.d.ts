import BaseChecker from './BaseChecker';
export default abstract class ColChecker extends BaseChecker {
    protected _opt: any;
    abstract _check(val: any, col?: any, param?: any): Promise<any>;
    abstract _createMsg(val: any, col?: any): any;
    protected _createError(param: any, col: string): Promise<Error>;
    _getCols(): Array<string>;
    check(param: any): Promise<void>;
}
