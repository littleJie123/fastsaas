import DataBuilder, { DataBuilderOpt, IDataBuilder } from "../DataBuilder";
export interface UrlBuilderOpt<Param = any, Result = any> extends DataBuilderOpt<Param, Result> {
    parseHttpParam?(httpParam: any, result: Result): Promise<any>;
}
export default class UrlBuilder<Param = any, Result = any> extends DataBuilder<Param, Result> {
    private url;
    private httpParam;
    private method;
    protected opt: UrlBuilderOpt<Param, Result>;
    setOpt(opt: UrlBuilderOpt<Param, Result>): IDataBuilder<Param, Result>;
    getName(): string;
    /**
     * 给子类重写，可以用于更改http的参数
     * @param result
     * @returns
     */
    protected parseHttpParam(result: Result): Promise<any>;
    constructor(url: string, httpParam?: any, method?: string);
    protected doRun(param: Param, result: Result): Promise<Result>;
}
