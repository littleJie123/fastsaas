import Context from "../context/Context";
import HttpEntryOpt from "../http/opt/HttpEntryOpt";
export default abstract class BaseHttpInf {
    constructor();
    private httpConfig;
    protected httpHostName: string;
    protected httpOtp: HttpEntryOpt;
    protected _context: Context;
    protected logger: any;
    setContext(context: Context): void;
    getContext(): Context;
    private _printLogger;
    private _comHttp;
    protected post(param?: any, opt?: any): Promise<any>;
    protected get(param?: any, opt?: any): Promise<any>;
    protected delete(param?: any, opt?: any): Promise<any>;
    protected put(param?: any, opt?: any): Promise<any>;
    static istio_header_keys: string[];
}
