import BaseOpControl from './BaseOpControl';
export default abstract class extends BaseOpControl {
    protected needDel(): boolean;
    protected needCheckName(): boolean;
    protected doExecute(): Promise<{
        [x: string]: any;
    }>;
}
