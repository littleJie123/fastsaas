import http from 'http'
import https from 'https'
import SafeHttpResult from '../SafeHttpResult';

interface BaseSafeHttpOpt{
    onTimeout?:()=>void;
    onError?:(message:string)=>void;
    encode?:string;
    timeout?:number;
    rejectUnauthorized?:boolean;
}
const S_Timeout = 5000;
export default class BaseSafeHttp{

    private opt:BaseSafeHttpOpt

    setOpt(opt:BaseSafeHttpOpt){
        this.opt = opt;
    }
    /**
     * 判断是http还是https
     * @param url 
     * @returns 
     */
    protected isHttp(url:URL):boolean{
        return !( url.protocol != null 
            && url.protocol.length>=5
            && url.protocol.toLocaleLowerCase().substring(0,5)=='https')
    }

    protected acqClient(url:URL) {
        if(this.isHttp(url))
            return http;
        return https;
    }

    /**
     * 将参数 转成 body，默认用json格式
     * @param params 
     * @returns 
     */
    protected parseParam2Body(params:any):string{
        let ret = JSON.stringify(params);
       
        return ret;
    }
    /**
     * 返回超时的时间
     * @returns 
     */
    protected getTimeout():number{
        let opt:BaseSafeHttpOpt = this.opt;
        let timeout = opt?.timeout;
        if(timeout == null)
            timeout = S_Timeout;
        return timeout
    }

    protected getMethod(){
        return 'post'
    }
    protected buildOptions(url:URL,params,headers,strBody:string):any{
        let port = url.port;
        if(port == null){
            if(this.isHttp(url)){
                port = '80'
            }else{
                port = '443'
            }
        }
        let rejectUnauthorized = this.opt?.rejectUnauthorized;
        
        return {
            hostname:url.hostname,
            port,
            method:this.getMethod(),
            timeout:this.getTimeout(),
            rejectUnauthorized,
            path:this.buildUrl(url,params),
            headers:this.buildHeaders(headers,strBody)
        }
    }

    protected needChangeUrl(){
        return false;
    }
    /**
     * 构建url ，get的接口用
     * @param url 
     * @param params 
     * @returns 
     */
    protected buildUrl(url:URL,params:any){
        let pathname = url.pathname;
        //console.log('url.search',url.search);
        if(url.search != '' && url.search != null){
            let search = url.search;
            if(search.startsWith('?')){
                search = search.substring(1)
            }
            pathname = `${pathname}?${search}`
        }
        if(!this.needChangeUrl()){
            return pathname
        }
        var array = []
        for (var e in params) {
            if (typeof params[e] === 'string') {
                array.push(e + '=' + encodeURIComponent(params[e]))
            } else {
                if(params[e] instanceof Array){
                    let vals = params[e];
                    for(let val of vals){
                        array.push(e+'=' +encodeURIComponent(val));
                    }
                }else{
                    array.push(e + '=' + encodeURIComponent(JSON.stringify(params[e])))
                }
            }
        }
         
        let str = array.join('&');
        let split = '?'
        if(pathname.indexOf('?')!=-1){
            split = '&'
        }
        return `${pathname}${split}${str}`
    }

    /**
     * 是否需要更改headers
     * @returns 
     */
    protected needChangeHeader(){
        return true;
    }

    /**
     * 返回请求的Content-Type
     */
    protected getContentType(){
        return 'application/json'
    }
    /**
     * 创建头部
     * @param headers 
     * @param strBody 
     */
    protected buildHeaders(headers:any,strBody:string){
        if(!this.needChangeHeader()){
            return headers;
        }
        let contentType = this.getContentType();
        let conentLength = strBody==null?0:Buffer.byteLength(strBody);
        return {
            ... headers,
            "Content-Type":contentType,
            "Content-length":conentLength
        }
    }
    /**
     * 提交请求
     * @param url 
     * @param params 
     * @param headers 
     * @returns 
     */
    submit(url:URL,params?:any,headers?:any):Promise<SafeHttpResult>{
        if(params == null)
            params = {}
        let client = this.acqClient(url)
        let opt = this.opt;
        let bodyStr = this.parseParam2Body(params)
        let options = this.buildOptions(url,params,headers,bodyStr);
        let isTimeout = false;
        let self = this; 
        return new Promise(function(resolve){ 
            let req = client.request(options,function(res){ 
                try{
                    let status:number = res.statusCode
                    if(status>=400){
                        resolve(null);
                        if(opt.onError){
                            opt.onError(`status is ${status}`)
                        }
                        return;
                    }
                    let chunks = [],
                        length = 0
                    res.on('data', chunk => {
                        length += chunk.length
                        chunks.push(chunk)
                        
                    })
                    res.on('end', () => { 
                        var buffer = Buffer.alloc(length)
                        for (var i = 0, pos = 0, size = chunks.length; i < size; i++) {
                            chunks[i].copy(buffer, pos)
                            pos += chunks[i].length
                        }
                        
                        let encode = opt?.encode;
                        if(encode == null)
                            encode = 'utf-8';
                        
                        resolve(self.parseResult(buffer.toString(encode)));
                    })
                    
                }catch(e){
                    console.error(e);
                    resolve(null);
                }
            }) 
            

            req.on('error', function(e) {  
                
                if(!isTimeout){
                    if(opt && opt?.onError){
                        opt.onError(e.message);
                    }
                    resolve(null)
                }
            })
            let timeout = self.getTimeout(); 
             
            req.setTimeout(timeout, () => { 
                req.abort(); // 如果超时，终止请求
                isTimeout = true;
                if(opt && opt.onTimeout){
                    opt.onTimeout();
                }
                resolve(null)
            });
            self.writeBody(req, bodyStr)
            req.end(); 
           
        })
        
    }


    /**
     * 是否需要写body
     */
    protected needWriteBody():boolean{
        return true;
    }


    
    protected writeBody(req,bodyStr:string){
        
        
        if(bodyStr != null && this.needWriteBody()){
             
            
            req.write(bodyStr);
             
        }
    }

    /**
     * 
     * @param str 
     * @returns 
     */
    protected parseResult(str:string){
        try{
            return JSON.parse(str);
        }catch(e){
            console.log(str)
            console.error(e);
            return null;
        }
    }
}