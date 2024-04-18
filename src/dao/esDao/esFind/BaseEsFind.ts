import Query from './../../query/Query';
import Context from './../../../context/Context';

export default abstract class {
    protected context:Context
    constructor(context:Context){
        this.context = context
    }

    
    getContext(){
        return this.context
    }
    buildQueryParam(ormQuery:Query){
        let must = [];
        let cdts = ormQuery.getCdts();
        for(let cdt of cdts){
            must.push(cdt.toEs())
        }
        let queryParam:any = {
           
            "query": {
                "bool": {
                    must
                }
            }
            
        }
        let sortParam =  this._buildOrder(ormQuery)
        if(sortParam != null)
            queryParam.sort = sortParam;
        queryParam.size = this.getRp(ormQuery);
        let first = this._buildFirst(ormQuery);
        if(first != null)
            queryParam.from = first
        return queryParam
    }
    /**
     * 返回页长
     * @param ormQuery 
     */
    protected getRp(ormQuery):number{
        let rp = ormQuery.getPager().rp;
        if(rp != null ){
            return rp;
        }else{
            return 10000;
        }
    }
    protected _buildFirst (query:Query) {
        var pager = query.getPager();
        if (pager != null) {
            if (pager.first) {
                return pager.first;
            }
        }
    }

    protected _buildOrder (query:Query) {
        var orders = query.getOrders();
        if (orders == null || orders.length == 0) { return; }
        var array = [];
        for (var order of orders) {
            array.push({
                [order.getCol()]: order.getDesc()
            });
        }
        return array;
    }
    abstract parseResult(query:Query,result:any)
}