import { BaseCdt, Context, Query } from "../fastsaas";
import LinkCdtOpt from "./LinkCdtOpt";
export default class OrCdtGeter {
    protected opt: LinkCdtOpt;
    constructor(opt: LinkCdtOpt);
    setContext(context: Context): void;
    setParam(param: any): void;
    process(query: Query, val: any): Promise<Query>;
    build(value: any): Promise<BaseCdt>;
}
