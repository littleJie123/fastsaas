import { Context } from "../fastsaas";
import DataBuilderObj from "./DataBuilderObj";
export interface IDataBuilder<Param, Result> {
    setRunner?(runner: any): unknown;
    run(param?: Param, result?: Result): Promise<Result>;
    getName(): string;
    setContext?(context: Context): IDataBuilder<Param, Result>;
}
export interface DataBuilderOpt<Param, Result> {
    pareseResult?(result: Result): Promise<Result>;
    defParam?: Param;
    buildRunner?: (result: Result) => any;
}
export default abstract class DataBuilder<Param = any, Result = any> implements IDataBuilder<Param, Result> {
    protected context: Context;
    protected opt: DataBuilderOpt<Param, Result>;
    /**
     * 上下文
     */
    protected runner: any;
    setRunner(runner: any): void;
    protected abstract doRun(param: Param, result: Result): Promise<Result>;
    setContext(context: Context): IDataBuilder<Param, Result>;
    setOpt(opt: DataBuilderOpt<Param, Result>): IDataBuilder<Param, Result>;
    run(param?: Param, result?: Result): Promise<Result>;
    abstract getName(): string;
    buildDataBuilderObj(param: Param, result: Result): DataBuilderObj<Param, Result>;
}
