import BaseEsFind from './BaseEsFind';
import Query from './../../query/Query';
export default class extends BaseEsFind {
    buildQueryParam(query: Query): any;
    private _buildAggs;
    private _buildHaving;
    parseResult(query: Query, result: any): any[];
}
