import { Request, Response } from 'express';
/**
 * 拦截器的父类
 */
export default abstract class BaseInterceptor {
    /**
     * 是否有效
     * @param req
     * @returns
     */
    protected isValid(req: Request): boolean;
    /**
     * 匹配的路径
     */
    protected abstract getPath(): string;
    protected isNot(): boolean;
    protected abstract doOnBefore(req: Request, resp: Response, param?: any): Promise<void>;
    /**
     *
     * @param req
     * @param resp
     * @returns 返回true表示停止运行
     */
    onBefore(req: Request, resp: Response, param?: any): Promise<boolean>;
    protected _sendError(resp: any, e: any): void;
}
