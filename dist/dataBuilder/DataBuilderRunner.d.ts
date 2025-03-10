import DataBuilder from "./DataBuilder";
export default class DataBuilderRunner<Param = any, Result = any> extends DataBuilder<Param, Result> {
    private builders;
    constructor(builders: DataBuilder<Param, Result>[]);
    run(): Promise<Result>;
}
