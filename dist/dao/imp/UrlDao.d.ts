import Dao from '../Dao';
interface UrlDaoOpt {
    url: string;
    /**
     * 从结果里面拿key,
     */
    key?: string;
    /**
     * http方法
     */
    method?: string;
    /**
     *  参数
     */
    param?: any;
}
/**
 * 构造参数
 * {
 *   url:'http://www.zaobao.com', 查询的url
 *   key:'result.content' //查询的字段，默认是result.content
 * }
 */
export default class extends Dao {
    private _urlOpt;
    constructor(opt: UrlDaoOpt);
    protected _initMap(): void;
    protected _acqExecutor(): import("../executor/IExecutor").default;
    executeSql(str: string): Promise<any>;
    find(param: any): Promise<any[]>;
    getDatasFromUrl(): Promise<any[]>;
}
export {};
