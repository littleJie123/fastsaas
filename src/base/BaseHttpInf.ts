 


import ConfigFac from "../config/ConfigFac";
import Context from "../context/Context";
import JsonDeleteHttp from "../http/imp/JsonDeleteHttp";
import JsonGetHttp from "../http/imp/JsonGetHttp";
import JsonPostHttp from "../http/imp/JsonPostHttp";
import JsonPutHttp from "../http/imp/JsonPutHttp";
import HttpEntryOpt from "../http/opt/HttpEntryOpt";


export default abstract class BaseHttpInf {
    constructor() {
        this.httpConfig = ConfigFac.get("httpconfig");
        
    }

    private httpConfig;
    protected httpHostName: string;
    protected httpOtp: HttpEntryOpt;
    protected _context: Context;
    protected logger: any;
    setContext(context: Context) {
        this._context = context;
    }
    getContext() {
        return this._context;
    }

    private _printLogger(message: any) {
        if (this._context == null) return;
        const logger = this._context.getLogger("HttpInf");

        logger.info(message); 
        
    }
    

    private async _comHttp(httpMethod: any, param?: any,opts?:any) {

        const beginTime = new Date().getTime();
         
        let httpOtp = { ...this.httpOtp, ...this.httpConfig[this.httpHostName] };
 
        if(opts){
            for(let e in opts){
                httpOtp[e] = opts[e];
            }
        }
        if(this._context != null) {
            const context_id = this._context.getId()
            if (httpOtp.headers == null) {
                httpOtp.headers = {}
            }
            
            httpOtp.headers['context_id'] = context_id
            // for(let headKey of BaseHttpInf.istio_header_keys){
            //     httpOtp.headers[headKey] = this.buildIstioHeader(headKey);
            // }
        }
        
        
        this._printLogger(httpOtp);
        this._printLogger(param); 
        
        const res = await new httpMethod(httpOtp).submit(param);

        const endTime = new Date().getTime();

        this._printLogger({ requestTime: endTime - beginTime }); 
        
        return res;
    }

    protected async post(param?: any,opt?:any) {
        return await this._comHttp(JsonPostHttp, param,opt);
    }

    protected async get(param?: any,opt?:any) {
        return await this._comHttp(JsonGetHttp, param,opt);
    }

    protected async delete(param?: any,opt?:any) {
        return await this._comHttp(JsonDeleteHttp, param,opt);
    }

    protected async put(param?: any,opt?:any) {
        return await this._comHttp(JsonPutHttp, param,opt);
    }

    static istio_header_keys = [
        'x-request-id',
        'x-b3-traceid',
        'x-b3-spanid',
        'x-b3-parentspanid',
        'x-b3-sampled',
        'x-b3-flags',
        'x-ot-span-context'
    ]

}
