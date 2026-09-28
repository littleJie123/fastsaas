import { BaseCdt, Query } from "../fastsaas";
import LinkCdtOpt from "./LinkCdtOpt";
export default class LinkCdtGeter {
    protected opt: LinkCdtOpt;
    constructor(opt: LinkCdtOpt);
    process(query: Query, val: any): Promise<Query>;
    build(value: any): Promise<BaseCdt>;
}
