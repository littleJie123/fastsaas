import DataBuilder from "./DataBuilder";
export default class MultiBuilder<Param = any, Result = any> extends DataBuilder<Param, Result> {
    private builders;
    constructor(builders: DataBuilder<Param, Result>[]);
    getName(): string;
    run(param: Param, result?: Result): Promise<Result>;
}
