import Control from "./Control";
export default abstract class extends Control {
    abstract getFileName(): string;
    protected _sendResp(resp: any, ret: any): void;
}
