import Context from './../context/Context';

export default abstract class  Searcher<Pojo = any>{
    

    protected _map = {};

    protected _context:Context;
    

    /**
     * 出事化，注册inquiry
     * @param context 
     */
    protected abstract init(context:Context);

    /**
     * 返回表格名
     */
    protected abstract getKey():string;

    setContext(context:Context){
        this._context = context;
    }

    getContext():Context{
        return this._context;
    }
    protected getIdKey(){
        //return this.getKey() + '_id';
        let dao = this.getDao();
        return dao.getPojoIdCol();
    }

    protected getDao():Dao{
        return this._context.get(this.getKey()+'Dao')
    }

    protected getNoKey(){
        return this.getKey() + '_no';
    }

    afterBuild(context:Context){
        
        this.reg('getById',new Inquiry({
            col:this.getIdKey()
        }));

        
        this.init(context);
        
        var map = this._map;
        for(var e in map){
            let inquiry:BaseInquiry = map[e];
            inquiry.setKey(this.getKey()); 
            inquiry.setContext(this._context);
        }
    }
    /**
     * 注册key
     * @param inquiryKey 
     * @param inquiry 
     */
    reg(inquiryKey:string,inquiry:BaseInquiry){
        inquiry.setSchColsOnReg(this.getSchCols());
        this._map[inquiryKey] = inquiry
    }

    protected getSchCols():Array<string>{
        return null;
    }

    _getAll():Array<BaseInquiry> {
        var array = []
        for (var e in this._map) {
            var inquiry = this._map[e]
            if (inquiry) {
                array.push(inquiry)
            }
        }
        return array
    }
    async save(key:string, array:Array<any>) {
        var inquiry = this.get(key)
        if (inquiry) {
          await inquiry.save(array)
        }
    }
    get(key):BaseInquiry {
        return this._map[key]
    }

    

    getCache(key):BaseCache{
        let inquiry = this.get(key);
        return inquiry.acqCache();
    }
    async saveAll(array:Array<any>) {
        var list = this._getAll()
        for (var i = 0; i < list.length; i++) {
            if (list[i].couldSaveAll()) {
                await list[i].save(array)
            }
        }
      // list.forEach(obj=>obj.save(array));
    }
    /**
     * 清空缓存，对于多表查询可能无效
     */
    clearCache() {
    
        var list = this._getAll()
        for (var i = 0; i < list.length; i++) {
            list[i].clearCache();
        }
      
    }
    /**
     * 根据ids 列表查询多条记录
     * @param array 
     */
    async findByIds(array:Array<any>,col?:string):Promise<Pojo[]>{
        var inquiry = this.get('getById')
        return await inquiry.find(array,col)
    }
    /**
     * 从缓存中拿
     * @param array 
     * @param col 
     */
    findByIdsFromCache(array:any,col?:string){
        var inquiry = this.get('getById')
        return  inquiry.acqDataFromCache(array,col)
    }

    async getById(id):Promise<Pojo>{
        if(id == null)
            return null;
        
        var list = await this.findByIds([id])
        return list[0]
    }
    /**
     * 从缓存中拿
     * @param array 
     * @param col 
     */
    getFromCache(id){
        if(id == null)
            return null;
        
        var list = this.findByIdsFromCache(id)
        return list[0]
    }

   
}
import Inquiry from './inquiry/imp/Inquiry'

import BaseInquiry from './inquiry/BaseInquiry'
import BaseCache from './inquiry/cache/BaseCache';
import Dao from './../dao/Dao';


