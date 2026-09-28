import { BaseCdt, Context, Query } from "../fastsaas";
import AndCdtGeterOpt from "./AndCdtGeterOpt";
import BaseLinkOpt from "./BaseLinkOpt";
import { LinkCdtResult } from "./LinkCdtImp";
/**
 * 取and的cdt
 */
export default class AndCdtGeter {
    private opt;
    constructor(opt: AndCdtGeterOpt);
    setContext(context: Context): void;
    setParam(param: any): void;
    isHit(key: string): boolean;
    processQuery(query: Query, param: any): Promise<Query>;
    protected buildCdt(param: any): Promise<{
        cdt?: BaseCdt;
        hasValue: boolean;
    }>;
    protected buildAndCdt(list: LinkCdtResult[]): BaseCdt;
    protected combineIds(array: LinkCdtResult[]): any[];
    protected buildLinkCdtOpt(): BaseLinkOpt;
}
