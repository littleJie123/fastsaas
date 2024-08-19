import BaseOpControl from './BaseOpControl';
/**
 * 从别的表里面拉取数据
 */
export default abstract class extends BaseOpControl {
    /**
     * 返回联合表的字段和
     * @returns
     */
    protected getJoints(): {
        /**
         * 联合表名
         */
        table: string;
        /**
         * 从联合表拿过来的字段
         */
        col: string;
        /**
         * 联合表的主键
         */
        pkCol?: string;
    }[];
    protected getData(): Promise<any>;
    processJoint(joint: {
        /**
         * 联合表名
         */
        table: string;
        /**
         * 从联合表拿过来的字段
         */
        col: string;
        /**
         * 联合表的主键
         */
        pkCol?: string;
    }, data: any): Promise<void>;
    doExecute(): Promise<void>;
}
