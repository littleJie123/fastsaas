import dns from 'dns'
interface IParam{
    hostname:string,
    opt:any
}
interface IDnsResult{
    err:any,
    address:any,
    family:any
}
interface MapVal{
    param:IParam,
    result:IDnsResult
}
/**
 * 从参数得到回调函数
 * @param args 
 */
function getCallbackFun(args:IArguments):Function{
    if(args.length == 3)
        return args[2]
    return args[1]
}
/**
 * 将参数构造成key
 * @param retArray 
 * @param opts 
 * @param key 
 * @param defVal 
 */
function add(retArray:any[],opts:any,key:string,defVal?:any){
    
    if(defVal == null)
        defVal = '';
    let val ;
    if(opts == null){
        val = defVal;
    }else{
        val = opts[key];
        if(val == null){
            val = defVal;
        }
    }
    retArray.push(`${key}_${val}`)
}
function calKeys(args:IArguments){
    if(args.length==2 || args[1] == null){
        return args[0]
    }
    let retArray = [];
    retArray.push(args[0]);
    let opts = args[1];
    if(typeof (opts)=='number' || opts instanceof Number){
        opts = {family:opts};
    }
    add(retArray,opts,'family',0);
    add(retArray,opts,'hints');
    add(retArray,opts,'all',false);
    add(retArray,opts,'verbatim',false);
    return retArray.join('___')
}
function getFromCache(args:IArguments,defVal:MapVal){
    let fun = getCallbackFun(args);
    let result = defVal.result;
    
    runFun(fun, result.err, result.address,result.family);
}

function runFun(fun,err,address,family){
    if(CoreDns.needTimeout){
        setTimeout(() => {
           fun(err,address,family)
        }, 15000);
    }else{

        
        fun(err,address,family)
    }
}

function proxyFun(lookup:Function,args:IArguments){

    let proxyArgs = changeProxyArgs(args);
    
    lookup.apply(dns,proxyArgs);
}
function changeProxyArgs(args:IArguments):any{
    let array = [];
    for(let i=0;i<args.length-1;i++)
        array.push(args[i]);
    let key = calKeys(args);
    let fun = args[args.length-1];
    let opt = null
    if(args.length==3)
        opt = args[1]
    array.push(function(err,address,family){
        let ret:MapVal = {
            param:{
                hostname:args[0],
                opt
            },
            result:{
                err,
                address,
                family
            }
        }
        map[key] = ret;
        
        runFun(fun,err,address,family)
    })
    return array;
}

let map = {};
export default class CoreDns{
    static lookup:Function;
    static timeout:any;
    static needTimeout:boolean = false;
    static init(){
        let  lookup = dns.lookup;
        this.lookup = lookup;
        let mydns:any = dns
        mydns['lookup'] = function():void{
            
            if(arguments.length<2 || arguments.length>3){
                lookup.apply(dns,arguments)
            }
            let key = calKeys(arguments);
            
            let mapVal = map[key]; 
            
            if(mapVal == null){ 
                
                proxyFun(lookup,arguments)
                
            }else{ 
                try{
                    getFromCache(arguments,mapVal);
                }catch(e){
                    proxyFun(lookup,arguments)
                }
            }

            
        }
        this.beginTimeout();
    }

    static beginTimeout(){
        if(this.timeout == null){
            this.timeout = this._checkOnTimeOut()
        }
    }

    private static _checkOnTimeOut(){
        setTimeout(() => {
            
            try{
                this.refreshCache()
            }catch(e){
                console.error(e);
            }
            this._checkOnTimeOut();
        }, 60*1000);
    }

    private static refreshCache(){
        
        for(let e in map){
            let val:MapVal = map[e];
            let param = val.param;
            this.lookup.apply(dns,[param.hostname,param.opt,function(err,address,family){
                let ret:MapVal = {
                    param,
                    result:{
                        err,
                        address,
                        family
                    }
                }
                map[e] = ret;
            }])
        }
        
    }
}