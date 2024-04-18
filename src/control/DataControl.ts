
import Control from './Control'
import Dao from './../dao/Dao';
/**
 * 处理单条数据
 */
export default abstract class DataControl extends Control{
    protected abstract _processData(data):Promise<any>;
    protected abstract _getNeedParamKey():Array<string>;
    protected getTableName(){

    }
    protected getDao():Dao{
        let tableName = this.getTableName();
        if(tableName == null){ 
            
            throw new Error('tableName没有指定');
        }
        return this.getContext().get(tableName+'dao');
    };
    async doExecute(){
        let data = await this._findData();
        if(data == null){
            throw this._createError();
        }
        return await this._processData(data);
    }

    _createError(){
        return new Error('对应的数据不存在');
    }

    async _findData():Promise<any>{
        var dao = this.getDao();
        var query = {};
        var param = this._param;
        let keys = this._getNeedParamKey();
        for(let key of keys){
            query[key] = param[key]
        }
        return await dao.findOne(query);
    }


    


}