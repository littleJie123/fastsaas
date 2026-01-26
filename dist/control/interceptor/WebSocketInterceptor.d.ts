import { Context, SocketProcessor } from '../../fastsaas';
/**
 * 拦截器的父类
 */
export default abstract class WebSocketInterceptor {
    protected context: Context;
    protected socketProcessor: SocketProcessor;
    setSocketProcessor(socketProcessor: SocketProcessor): void;
    setContext(context: Context): void;
    /**
     * 是否有效
     * @param req
     * @returns
     */
    protected isValid(url: string): boolean;
    protected getPaths(): string[];
    /**
     * 匹配的路径
     */
    protected getPath(): string;
    protected isNot(): boolean;
    protected abstract doOnBefore(param: any, url: string): Promise<void>;
    /**
     *
     * @param req
     * @param resp
     * @returns 返回true表示停止运行
     */
    onWebSocketBefore(url: string, param?: any): Promise<boolean>;
    protected _sendError(resp: any, e: any): void;
    getSocketProcessor(): SocketProcessor;
}
