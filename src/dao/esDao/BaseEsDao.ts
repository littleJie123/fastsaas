
import JsonPostHttp from './../../http/imp/JsonPostHttp';
import ConfigFac from './../../config/ConfigFac';
import JsonGetHttp from './../../http/imp/JsonGetHttp';
import Query from "../query/Query";

import DaoOpt from "../opt/DaoOpt";
import BaseEsFind from "./esFind/BaseEsFind";
import EsFind from "./esFind/EsFind";
import EsGroup from "./esFind/EsGroup";
import Dao from "../Dao";
import IExecutor from "../executor/IExecutor";




interface EsDaoOpt  {
    type?:string;
    url?:string;
    index:string
}
export default class extends Dao{
    private esDaoOpt:EsDaoOpt;
    constructor(opt:EsDaoOpt){
        
        super({}) 
        this.esDaoOpt = opt;
    }
    protected _initMap() {
        //没必要实现该方法
    }
    protected _acqExecutor(): IExecutor {
        //没必要实现该方法
        return null
    } 
    
    async findOne(query){
        let list = await this.find(query);
        return list[0];
    }

    async update(data):Promise<any>{
        let id = data._id;
        if(id != null){
            delete data._id;
        }else{
            id = data.id;
        }
        if(id != null){
            await this.doPost(id,data);
        }

    }

    private async submit(clazz,path:string,param?:any){
        if(param == null)
            param = {}
        let url = this.buildUrl(path) 
        let logger = this.getContext().getLogger('esDao')
        logger.debug(url)
        let http = new clazz({
            url
        }) 
        
        let result =await http.submit(param);
        return result;
    }

    private async doPost(path:string,param?:any){
        return this.submit(JsonPostHttp,path,param)
        
    }

    private async doGet(path,param?:any){
        return this.submit(JsonGetHttp,path,param)
        
    }

    private buildUrl(path:string){
        if(path.substring(0,1) != '/')
            path = '/'+path;
        let es = ConfigFac.get('es');
        let opt = this.getOpt();
        let url:string = opt.url;
        if(url == null)
            url = es.url;
        if(!url.endsWith('/')){
            url = url +'/'
        }
        
        
        let ret = null;
        if(opt.type != null)
            ret = `${url}${opt.index}/${opt.type}${path}`
        else
        ret = `${url}${opt.index}${path}`
        return ret;
        
    }
    
    getOpt():EsDaoOpt{
        return  this.esDaoOpt;

    }
    async get(id){
        let result = await this.doGet(id);
        if(result == null)
            return {};
        let data = result._source;
        if(data == null)
            return {};
        data._id = result._id;
        return data;

    }
    

    
    async find(query):Promise<any[]>{
        let ormQuery = Query.parse(query);
        let findEs:BaseEsFind = this.buildFinder(ormQuery)
        
        let queryParam = findEs.buildQueryParam(ormQuery)
        let logger = this.getContext().getLogger('esDao')
        logger.debug(JSON.stringify(queryParam))
        let result = await this.doPost('_search',queryParam)
        return findEs.parseResult(ormQuery,result);
    }

    async findCnt(query):Promise<number>{
        let ormQuery = Query.parse(query);
        let findEs:BaseEsFind = this.buildFinder(ormQuery)
        
        let queryParam = findEs.buildQueryParam(ormQuery)
        delete queryParam.size;
        delete queryParam.sort;
        delete queryParam.from;
        let logger = this.getContext().getLogger('esDao')
        logger.debug(JSON.stringify(queryParam))
        let result = await this.doPost('_count',queryParam)
    
        return result.count;
        
        //return findEs.parseResult(ormQuery,result);
    }

    private buildFinder(query:Query){
        let groups = query.getGroups();
        if(groups != null && groups.length>0){
            return new EsGroup(this.getContext())
        }else{
            return new EsFind(this.getContext());
        }
    }


}