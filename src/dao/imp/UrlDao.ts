import Formula from './../../formula/Formula';
import FormulaParser from './../../formula/parser/FormulaParser';
import JsonGetHttp from './../../http/imp/JsonGetHttp';
import JsonUtil from './../../util/JsonUtil';
import JsonPostHttp from './../../http/imp/JsonPostHttp';

import Query from '../query/Query'
import Dao from '../Dao'
import DaoOpt from '../opt/DaoOpt'
import ArrayDao from './ArrayDao';



interface UrlDaoOpt {
    /*
    访问的url
    */
    url:string; 
    /**
     * 从结果里面拿key,
     */
    key?:string; 
    /**
     * http方法
     */
    method?:string; 
    /**
     *  参数
     */
    param?:any; 
}
/**
 * 构造参数
 * {
 *   url:'http://www.zaobao.com', 查询的url
 *   key:'result.content' //查询的字段，默认是result.content
 * }
 */

export default class extends Dao{
    private _urlOpt:UrlDaoOpt
    constructor(opt:UrlDaoOpt){
        super({})
        this._urlOpt = opt;
    }
    protected _initMap() {
        throw new Error("Method not implemented.");
    }
    protected _acqExecutor(): import("../executor/IExecutor").default {
        throw new Error("Method not implemented.");
    }
    executeSql(str:string):Promise<any>{
        throw new Error('该方法没有实现');
    }
    async find(param:any):Promise<any[]>{
        let data = await this.getDatasFromUrl();
        
        let arrayDao = new ArrayDao(data);
        
        return arrayDao.find(param);
    }

    async getDatasFromUrl():Promise<any[]>{
        let opt = this._urlOpt;

        let http = null;
        if(opt.method !=null && opt.method.toLowerCase() == 'post'){
            http = new JsonPostHttp({
                url:opt.url
            })
        }else{
            http = new JsonGetHttp({url:opt.url})
        }
        let param = opt.param;
        if(param == null){
            param = {}
        }
        let ret = await http.submit(param);
        let array = [];
        if(ret){
            
            let key = opt.key;
            if(key == null || key==''){
                key = 'result.content'
            }
            array = JsonUtil.get(ret,key.split('.'))
        }
        return array;
    }


}