import JsonKey from '../JsonKey';
export default class extends JsonKey {
    private _key;
    protected _parse(keys: any): void;
    protected _acqKey(): string;
    protected _hasKey(): boolean;
    protected _isArray(result: any): result is any[];
    protected _getArray(result: any): any[];
    _enter(result: any): any;
    _change(result: any): void;
    change(result: any): any;
}
