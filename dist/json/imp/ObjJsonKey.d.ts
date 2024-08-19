import JsonKey from '../JsonKey';
export default class extends JsonKey {
    private _keys;
    _parse(keys: any): void;
    _acqKey(): string;
    _enter(result: any): any;
    _change(result: any): any;
}
