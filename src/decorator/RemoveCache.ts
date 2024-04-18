import DaoUtil from './../util/DaoUtil';
import DefOnChangeOpt from './../util/inf/imp/DefOnChangeOpt';
import Searcher from './../searcher/Searcher';
import {ArrayUtil} from './../util/ArrayUtil';
import {BeanUtil} from './../util/BeanUtil';

/**
 * 该标签将在dao的增删改查中 清空对应的缓存
 */


interface RemoveCacheOpt{
    cacheNames:string[];
}
export default  function(opt:RemoveCacheOpt){
    
    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            private _searcher:Searcher;
            private _getSearcher(){
                if(this._searcher == null){
                    let self:any = this; //只是保证编译不出错
                    let context = self.getContext()
                    let tablename = self.getTableName();
                    this._searcher = context.get(tablename + 'searcher')

                }
                return this._searcher;
            }
            async clearCache(obj){
                if(obj == null)
                    return;
                let array:any[] = null;
                if(obj instanceof Array){
                    array = obj;
                }else{
                    array = [obj];
                }
                
                for(let cacheName of opt.cacheNames){
                    
                    await this._clearCache(cacheName,array);
                }
            }

            private async _clearCache(cacheName,array:any[]){
                
                let searcher = this._getSearcher();
                
                let inquiry = searcher.get(cacheName);
                
               
                if(inquiry != null){
                    await inquiry.removeCache(array);
                }
            }



            async add(obj) {
                let ret = await super['add'](obj)
                await this.clearCache(obj);
                return ret;
            }

            async del(obj, opts) {

                let datas = await this._buildDelDataForClear(obj);
                let ret = await super['del'](obj,opts)
                await this.clearCache(datas);
                return ret;
            }

            async delArray(array: Array<any>, opts?: any) {
                let datas = await this._buildDelDataForClear(array);
                let ret = await super['delArray'](array,opts)
                
                await this.clearCache(datas);
                return ret;
            }

            async addArray(array: Array<any>) {
                let ret = await super['addArray'](array)
                await this.clearCache(array);
                return ret;
            }

            private async _buildUpdateDataForClear(obj:any){
                let array:any[];
                if(obj instanceof Array){
                    array = obj;
                }else{
                    array = [obj];
                }
                let self:any = this;
                let pkCol = self._opt.acqFirstId();
                let pks = ArrayUtil.toArray(array,pkCol);
                let searcher = this._getSearcher();
                let datas = await searcher.findByIds(pks);
                let updateDataMap = ArrayUtil.toMapByKey(array,pkCol);
                let retArray = [];
                retArray.push(... datas);
                for(let data of datas){
                    let pk = data[pkCol];
                    let updateData = updateDataMap[pk];
                    if(updateData){
                        let row = BeanUtil.shallowCombine(updateData,data);
                        retArray.push(row);
                    }
                }
                
                return retArray;

            }

            private async _buildDelDataForClear(obj:any){
                let datas:any[];
                if(obj instanceof Array){
                    datas = obj;
                }else{
                    datas = [obj];
                }
                let self:any = this;
                let retArray = [];
                let needFind = [];
                let searcher = this._getSearcher();
                
                for(let data of datas){
                    let dataOk = true;
                    for(let cacheName of opt.cacheNames ){
                        let quiry = searcher.get(cacheName);
                        if(quiry != null){
                            let dataKey = quiry.acqDataCode(data);
                            if(dataKey == null){
                                dataOk = false;
                                break;
                            }
                        }
                    }
                    if(dataOk){
                        retArray.push(data);
                    }else{
                        needFind.push(data);
                    }
                }
                let pkCol = self._opt.acqFirstId();
                let pks = ArrayUtil.toArray(needFind,pkCol);
                let findDatas = await searcher.findByIds(pks);
                
                
                return [... retArray,... findDatas];
                

            }

            async update(obj, whereObj?): Promise<number> {
                let self:any = this;
                let datas = await this._buildUpdateDataForClear(obj)
                
                let ret = await super['update'](obj,whereObj);
                await this.clearCache(datas);
                return ret;
            }

            async updateArray(datas: Array<any>, other?: object,whereObj?:any){
                let self:any = this;
                let array = await this._buildUpdateDataForClear(datas)
                let ret = await super['updateArray'](datas,other,whereObj);
                await this.clearCache(array);
                return ret;
            }
        }
    }
}

