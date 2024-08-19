import Context from './../context/Context';
import LogHelp from './../log/LogHelp';
import SafeHttpOpt from "./opt/SafeHttpOpt";
export default class SafeHttpClient {
    private context;
    private opt;
    private defValueMap;
    setContext(context: Context): void;
    setOpt(opt: SafeHttpOpt): void;
    /**
     * 得到日志工具
     * @returns
     */
    protected getLogger(): LogHelp;
    /**
     * 得到默认值
     * @param url
     */
    protected getDefValue(url: URL): any;
    /**
     * 得到一个含有默认值的map，键值是url的path
     */
    protected getDefValueMap(): any;
    setDefValueMap(defValueMap: any): void;
    /**
     * 得到错误的阈值，超过不再请求返回默认值
     * @returns
     */
    protected getThreshold(): number;
    /**
     * 得到
     * @returns
     */
    protected getOpt(): SafeHttpOpt;
    /**
     * 得到超时时间
     * @returns
     */
    protected getTimeout(): number;
    post(url: string, params?: any, headers?: any): Promise<any>;
    get(url: string, params?: any, headers?: any): Promise<any>;
    put(url: string, params?: any, headers?: any): Promise<any>;
    delete(url: string, params?: any, headers?: any): Promise<any>;
    /**
     * 得到请求对计数器
     * @param url
     * @returns
     */
    protected getHttpTimeCnt(url: URL): any;
    /**
     * 得到错误的计数器
     * @param url
     * @returns
     */
    protected getErrorTimeCnt(url: URL): any;
    /**
     * 从一个map中取值，没有就新建一个
     * @param map
     * @param key
     * @param fun
     * @returns
     */
    protected getFromMap(map: any, key: string, fun: () => any): any;
    isValid(url: URL): boolean;
    private submit;
    /**
     * 工厂方法
     * @param method
     * @returns
     * @todo
     */
    private getSafeHttp;
}
