import Context from './../context/Context';
import LogHelp from './../log/LogHelp';
import TimeCnt from "../wiget/TimeCnt";
import TimeObj from "../wiget/TimeObj";
import TimeOpt from "../wiget/TimeOpt";
import SafeHttpOpt from "./opt/SafeHttpOpt";
import BaseSafeHttp from "./safeHttp/BaseSafeHttp";
import SafeDeleteHttp from "./safeHttp/SafeDeleteHttp";
import SafeGetHttp from "./safeHttp/SafeGetHttp";
import SafePostHttp from "./safeHttp/SafePostHttp";
import SafePutHttp from "./safeHttp/SafePutHttp";
import SafeHttpResult from "./SafeHttpResult";
import { Url } from "url";

let httpMap = {};
let errorMap = {}
const S_Timeout = 5000;
const S_Threshold = 100;

export default  class SafeHttpClient{


    private context:Context;
    private opt:SafeHttpOpt;
    private defValueMap:any;

    setContext(context:Context){
        this.context = context;
    }

    setOpt(opt:SafeHttpOpt){
        this.opt = opt;
    }
    /**
     * 得到日志工具
     * @returns 
     */
    protected getLogger():LogHelp{
        if(this.context != null)
            return this.context.getLogger('safeHttpClient');
        let logger = new LogHelp();
        logger.setCategory('safeHttpClient')
        return logger;
    }
    /**
     * 得到默认值
     * @param url 
     */
    protected getDefValue(url:URL){
        let map = this.getDefValueMap();
        if(map != null){
            let path = url.pathname;
            let defValue = map[path];
            if(defValue != null){
                return {
                    ... defValue,
                    infServerIsNotSafe:true
                }
            }
        }
        return {
           
            infServerIsNotSafe:true
        } 
        
    }
    /**
     * 得到一个含有默认值的map，键值是url的path
     */
    protected getDefValueMap(){
        return this.defValueMap;
    }

    setDefValueMap(defValueMap:any){
        this.defValueMap = defValueMap;
    }

    /**
     * 得到错误的阈值，超过不再请求返回默认值
     * @returns 
     */
    protected getThreshold():number{
        let ret = this.getOpt()?.thresh;
        if(ret == null)
            ret = S_Threshold;
        return ret;
    }

    /**
     * 得到
     * @returns 
     */
    protected getOpt():SafeHttpOpt{
        return this.opt;
    }

    /**
     * 得到超时时间
     * @returns 
     */
    protected getTimeout(){
        let ret = this.getOpt()?.timeout;
        if(ret == null)
            ret = S_Timeout;
        return ret;
    }
    

    post(url:string,params?:any,headers?:any):Promise<any>{
        return this.submit('post',url,params,headers)
    }

    get(url:string,params?:any,headers?:any):Promise<any>{
        return this.submit('get',url,params,headers)
    }

    put(url:string,params?:any,headers?:any):Promise<any>{
        return this.submit('put',url,params,headers)
    }

    delete(url:string,params?:any,headers?:any):Promise<any>{
        return this.submit('delete',url,params,headers)
    }
    /**
     * 得到请求对计数器
     * @param url 
     * @returns 
     */
    protected getHttpTimeCnt(url:URL){
        let host = url.hostname;
        return this.getFromMap(httpMap,host,()=>new TimeCnt(this.getOpt()))
    }
    /**
     * 得到错误的计数器
     * @param url 
     * @returns 
     */
    protected getErrorTimeCnt(url:URL){
        let host = url.hostname;
        return this.getFromMap(errorMap,host,()=>new TimeCnt(this.getOpt()))
    }
    /**
     * 从一个map中取值，没有就新建一个
     * @param map 
     * @param key 
     * @param fun 
     * @returns 
     */
    protected getFromMap(map:any,key:string,fun:()=>any){
        let ret = map[key];
        if(ret == null){
            ret = fun();
            map[key] = ret;
        }
        return ret;
    }

    isValid(url:URL){
        let timeCnt:TimeCnt = this.getHttpTimeCnt(url)
        let errorCnt:TimeCnt = this.getErrorTimeCnt(url);
         
        return (timeCnt.get()+errorCnt.get())<this.getThreshold();
    }
    private async submit(method: string, strUrl: string, params: any, headers: any): Promise<SafeHttpResult> {
        
        if(headers == null){
            headers = {}
        }
        if(this.context != null){
            headers = {
                ... headers,
                context_id:this.context.getId()
            }
        }
        let url = new URL(strUrl);
        let logger = this.getLogger();
        let simpleUrl = `${url.hostname}${url.pathname}`
        logger.infoObj({
            target:url.hostname,
            url:simpleUrl,
            params:JSON.stringify(params),
            action:'begin'
        })
        if(this.isValid(url)){
            let timeCnt:TimeCnt = this.getHttpTimeCnt(url)
            let errorCnt:TimeCnt = this.getErrorTimeCnt(url);
            let timeObj:TimeObj<number> = timeCnt.add();
            let safeHttp = this.getSafeHttp(method);
            if(safeHttp != null){
                safeHttp.setOpt({
                    onError:(msg:string)=>{
                        logger.ding(`${simpleUrl}出错了,${msg}`);
                        errorCnt.add()
                    },
                    onTimeout:()=>{
                        logger.ding(`${simpleUrl}超时了`);
                        errorCnt.add()
                    },
                    timeout:this.getTimeout()
                })
                let timebegin = new Date().getTime()
                let ret = await safeHttp.submit(url,params,headers);
                if(ret == null){
                    ret = this.getDefValue(url);
                }
                timeObj.obj -- ;

                logger.infoObj({
                    target:url.hostname,
                    url:simpleUrl,
                    params:JSON.stringify(params),
                    action:'end',
                    times:new Date().getTime()-timebegin
                })
                return ret;
            }
        }else{
            logger.ding(`${simpleUrl} 已经不健康了`)
            return  this.getDefValue(url);
            
        }
    }
    /**
     * 工厂方法
     * @param method 
     * @returns
     * @todo 
     */
    private getSafeHttp(method:string):BaseSafeHttp{
        if(method == null)
            method ='post';
        method = method.toLowerCase();
        let ret:BaseSafeHttp = null;
        if(method == 'post')
            ret = new SafePostHttp();
        if(method == 'get')
            ret = new SafeGetHttp();
        if(method == 'put')
            ret = new SafePutHttp();
        if(method == 'delete')
            ret = new SafeDeleteHttp();
        if(ret != null){
            ret.setOpt(this.getOpt())
        }
        return ret;
    }
}