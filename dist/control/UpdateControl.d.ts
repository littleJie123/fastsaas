import BaseOpControl from "./BaseOpControl";
export default abstract class extends BaseOpControl {
    doExecute(): Promise<any>;
}
