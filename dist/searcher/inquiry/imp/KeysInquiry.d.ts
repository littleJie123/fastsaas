import Inquiry from './Inquiry';
export default class KeysInquiry extends Inquiry {
    acqColKeys(): string[];
    _acqCodeByKeys(params: any): string;
    acqCode(params: any): string;
    acqDataCode(data: any): string;
    protected _buildCdt(params: any): Promise<any>;
    _findArray(params: Array<any>): Promise<Array<any>>;
    private _buildArrayCdt;
    private _buildKeyCdt;
}
