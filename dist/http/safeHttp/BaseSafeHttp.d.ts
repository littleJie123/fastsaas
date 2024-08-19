/// <reference types="node" />
/// <reference types="node" />
import http from 'http';
import https from 'https';
import SafeHttpResult from '../SafeHttpResult';
interface BaseSafeHttpOpt {
    onTimeout?: () => void;
    onError?: (message: string) => void;
    encode?: string;
    timeout?: number;
    rejectUnauthorized?: boolean;
}
export default class BaseSafeHttp {
    private opt;
    setOpt(opt: BaseSafeHttpOpt): void;
    /**
     * 判断是http还是https
     * @param url
     * @returns
     */
    protected isHttp(url: URL): boolean;
    protected acqClient(url: URL): typeof https | typeof http;
    /**
     * 将参数 转成 body，默认用json格式
     * @param params
     * @returns
     */
    protected parseParam2Body(params: any): string;
    /**
     * 返回超时的时间
     * @returns
     */
    protected getTimeout(): number;
    protected getMethod(): string;
    protected buildOptions(url: URL, params: any, headers: any, strBody: string): any;
    protected needChangeUrl(): boolean;
    /**
     * 构建url ，get的接口用
     * @param url
     * @param params
     * @returns
     */
    protected buildUrl(url: URL, params: any): string;
    /**
     * 是否需要更改headers
     * @returns
     */
    protected needChangeHeader(): boolean;
    /**
     * 返回请求的Content-Type
     */
    protected getContentType(): string;
    /**
     * 创建头部
     * @param headers
     * @param strBody
     */
    protected buildHeaders(headers: any, strBody: string): any;
    /**
     * 提交请求
     * @param url
     * @param params
     * @param headers
     * @returns
     */
    submit(url: URL, params?: any, headers?: any): Promise<SafeHttpResult>;
    /**
     * 是否需要写body
     */
    protected needWriteBody(): boolean;
    protected writeBody(req: any, bodyStr: string): void;
    /**
     *
     * @param str
     * @returns
     */
    protected parseResult(str: string): any;
}
export {};
