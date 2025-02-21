import Searcher from './../searcher/Searcher';
/**
 * 该标签将在dao的增删改查中 清空对应的缓存
 */
interface RemoveCacheOpt {
    cacheNames: string[];
}
export default function (opt: RemoveCacheOpt): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => {
    new (...args: any[]): {
        _searcher: Searcher;
        _getSearcher(): Searcher<any>;
        clearCache(obj: any): Promise<void>;
        _clearCache(cacheName: any, array: any[]): Promise<void>;
        add(obj: any): Promise<any>;
        del(obj: any, opts: any): Promise<any>;
        delArray(array: Array<any>, opts?: any): Promise<any>;
        addArray(array: Array<any>): Promise<any>;
        _buildUpdateDataForClear(obj: any): Promise<any[]>;
        _buildDelDataForClear(obj: any): Promise<any[]>;
        update(obj: any, whereObj?: any): Promise<number>;
        updateArray(datas: Array<any>, other?: object, whereObj?: any): Promise<any>;
    };
} & T;
export {};
