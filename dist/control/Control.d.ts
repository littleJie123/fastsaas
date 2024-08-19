/**
 * 控制层父亲类
 */
import LogHelp from './../log/LogHelp';
import Context from './../context/Context';
import { Request, Response } from 'express';
interface IExe {
    process(param: any, req: Request, resp: Response): Promise<any>;
}
export default class Control<Param = any, Result = any> {
    protected _param: Param;
    protected _req: Request;
    protected _resp: Response;
    protected _context: Context;
    protected beforeControlProcess: IExe;
    getContext(): Context;
    /**
     * 返回这次操作的名称
     */
    protected _getName(): string;
    /**
     * 数组需要的key列表
     */
    protected _getNeedArrayKeys(): Array<string>;
    /**
     * 检查数组形式
     * @param param
     */
    protected _checkArray(param: any): void;
    protected getCheckers(): Array<IChecker>;
    /**
     * 检查输入参数是否正确
     */
    protected _checkParam(param: any): Promise<void>;
    protected _checkHeader(headers: any): Promise<void>;
    protected _getNeedParamKey(): Array<string>;
    protected _getNeedHeaderKey(): Array<string>;
    setContext(context: any): void;
    protected _getLogger(category?: string): LogHelp;
    protected _printLog(message: object, category?: string): void;
    protected _printBeforeLog(req: any): void;
    protected _printEndLog(time: number): void;
    execute(req: Request, resp: Response): Promise<void>;
    protected _sendError(resp: any, e: any): void;
    protected _printErrorLog(error: Error): void;
    protected _sendResp(resp: any, ret: any): void;
    protected _processRet(ret: any): any;
    protected doExecute(req?: Request, resp?: Response): Promise<Result>;
    executeParam(param: any): Promise<Result>;
    buildControl(controlClazz: any): Control;
}
import IChecker from './inf/IChecker';
export {};
