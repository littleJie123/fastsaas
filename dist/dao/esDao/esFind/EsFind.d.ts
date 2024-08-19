/**
 * 普通的查询
 *
 */
import BaseEsFind from './BaseEsFind';
import Query from './../../query/Query';
export default class extends BaseEsFind {
    parseResult(query: Query, result: any): any[];
}
