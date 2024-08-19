"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(context) {
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    buildQueryParam(ormQuery) {
        let must = [];
        let cdts = ormQuery.getCdts();
        for (let cdt of cdts) {
            must.push(cdt.toEs());
        }
        let queryParam = {
            "query": {
                "bool": {
                    must
                }
            }
        };
        let sortParam = this._buildOrder(ormQuery);
        if (sortParam != null)
            queryParam.sort = sortParam;
        queryParam.size = this.getRp(ormQuery);
        let first = this._buildFirst(ormQuery);
        if (first != null)
            queryParam.from = first;
        return queryParam;
    }
    /**
     * 返回页长
     * @param ormQuery
     */
    getRp(ormQuery) {
        let rp = ormQuery.getPager().rp;
        if (rp != null) {
            return rp;
        }
        else {
            return 10000;
        }
    }
    _buildFirst(query) {
        var pager = query.getPager();
        if (pager != null) {
            if (pager.first) {
                return pager.first;
            }
        }
    }
    _buildOrder(query) {
        var orders = query.getOrders();
        if (orders == null || orders.length == 0) {
            return;
        }
        var array = [];
        for (var order of orders) {
            array.push({
                [order.getCol()]: order.getDesc()
            });
        }
        return array;
    }
}
exports.default = default_1;
