import BaseCache from '../BaseCache';
import FindResult from '../dto/FindResult';
export default class MapCache extends BaseCache {
    private _map;
    find(optArray: any): Promise<FindResult>;
    clearCache(): Promise<void>;
    _getMap(): {};
    acqKeys(): any[];
    save(e: any, list: any): Promise<void>;
    get(e: any): any;
    _removeCache(array: any): Promise<void>;
    saveArray(opts: any, dbs: any): any;
}
