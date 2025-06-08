import BaseInquiry from "../BaseInquiry";
import BaseInquiryOpt from "../BaseInquiryOpt";
interface GetInquiryOpt extends BaseInquiryOpt {
    paramFun?(param: any): string;
    fun(param: any): Promise<any>;
}
export default class extends BaseInquiry {
    protected _opt: GetInquiryOpt;
    constructor(opt: GetInquiryOpt);
    protected _findFromDb(params: any[]): Promise<any[]>;
    acqDataCode(data: any): string;
    acqCode(param: any): string;
}
export {};
