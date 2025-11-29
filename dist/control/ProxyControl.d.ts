import Control from "./Control";
export default abstract class extends Control {
    abstract getControl(): any;
    protected doExecute(req: any, resp: any): Promise<any>;
}
