import DataBuilder, { IDataBuilder } from "../DataBuilder";
export default class MultiBuilder<Param = any, Result = any> extends DataBuilder<Param, Result> {
    private builders;
    constructor(builders: IDataBuilder<Param, Result>[]);
    getName(): string;
    doRun(param: Param, result?: Result): Promise<Result>;
}
