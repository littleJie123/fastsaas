import BaseOpControl from "./BaseOpControl";
export default abstract class<Pojo = any> extends BaseOpControl {
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    protected abstract processPojo(pojo: Pojo): Promise<void>;
    checkDataCdt(pojo: Pojo): boolean;
    protected needCheckName(): boolean;
}
