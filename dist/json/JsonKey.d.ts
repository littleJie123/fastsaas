export default abstract class JsonKey {
    protected _fun: Function;
    protected _next: JsonKey;
    protected _enter(result: any): void;
    protected _change(result: any): void;
    protected _parse(keys: any): void;
    protected abstract _acqKey(): string;
    /**
    opt:{
      keys:['aa#bb'],
      fun:function
    }
    */
    constructor(opt: any);
    setNext(next: JsonKey): void;
    change(result: any): any;
    static get(str: any, fun: any): JsonKey;
}
