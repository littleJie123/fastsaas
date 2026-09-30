import Control from "./Control";
export default abstract class extends Control {
    abstract getControl(): any;
    protected doExecute(): Promise<any>;
}
