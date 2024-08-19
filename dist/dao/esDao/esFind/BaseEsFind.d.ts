import Query from './../../query/Query';
import Context from './../../../context/Context';
export default abstract class {
    protected context: Context;
    constructor(context: Context);
    getContext(): Context;
    buildQueryParam(ormQuery: Query): any;
    /**
     * 返回页长
     * @param ormQuery
     */
    protected getRp(ormQuery: any): number;
    protected _buildFirst(query: Query): any;
    protected _buildOrder(query: Query): any[];
    abstract parseResult(query: Query, result: any): any;
}
