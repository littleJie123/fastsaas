/**
 * 联合表的查询条件
 */
import Query from './../dao/query/Query';
import ListControl from "./ListControl";
import JointWiget from "./wiget/JointWiget";
import JointOpt from "./opt/JointOpt";
export default abstract class extends ListControl {
    protected jointWigets: JointWiget[];
    abstract getJointOpt(): JointOpt[];
    protected buildQuery(): Promise<Query>;
    protected addCdt(query: Query): Promise<void>;
    /**
     * 返回 联合查询的组件
     * @returns
     */
    protected getJointWiget(): JointWiget[];
}
