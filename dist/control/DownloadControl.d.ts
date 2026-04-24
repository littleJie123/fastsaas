import Control from "./Control";
export default abstract class<Param = any> extends Control<Param> {
    abstract getFileName(): string;
    protected _sendResp(resp: any, ret: any): void;
}
