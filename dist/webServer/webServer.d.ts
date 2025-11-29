import { WebSocketTokenOpt } from '../interface/Websocket.interface';
import Context from '../context/Context';
import { Request, Response } from 'express';
export interface WebServerOption {
    /**
     *
     */
    webPath?: string;
    webSocketClazz?: any;
    webSocketOpt?: any;
    webSocketTokenOpt?: WebSocketTokenOpt;
    port?: number;
    /**
     * 中间件
     */
    mids?: Array<((req?: Request, resp?: Response, next?: Function) => void)>;
    midsMap?: {
        [url: string]: ((req?: Request, resp?: Response, next?: Function) => void);
    };
    context?: Context;
    /**
     * 保留body
     */
    keepBody?: boolean;
    interceptorBeans?: string[];
}
export default function (opt: WebServerOption): any;
