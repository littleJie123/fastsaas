import Inquiry from "./Inquiry";
import BaseInquiryOpt from "../BaseInquiryOpt";
interface Opt extends BaseInquiryOpt {
    funName?: string;
    fun?(param: any): boolean;
    otherCdt?: any;
}
export default class ProxyInquiry extends Inquiry {
    protected _opt: Opt;
    couldSaveAll(): boolean;
    _couldSave(): boolean;
    find(param: any, col?: any): Promise<any>;
    protected _filter(list: any): any;
    acqDataFromCache(param: any): any;
}
export {};
