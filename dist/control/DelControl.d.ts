import BaseOpControl from './BaseOpControl';
export default abstract class extends BaseOpControl {
    /**
     * 默认false，也就是逻辑删除
     * @returns
     */
    protected needDel(): boolean;
    protected needCheckName(): boolean;
    protected doExecute(): Promise<{
        [x: string]: any;
    }>;
    protected onDel(pk: any): Promise<void>;
}
