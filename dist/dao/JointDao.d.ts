import Context from "../context/Context";
import MySqlDao from "./MySqlDao";
import { JointDaoParam } from "./opt/JointDaoOpt";
/**
 * 一个联合查询的dao，只支持查询
 */
export default class JointDao extends MySqlDao {
    constructor(opt: JointDaoParam);
    getContext(): Context;
    /**
     * 联合查询不能执行更新
     */
    protected _execute(key: string, obj: any, opts?: any): Promise<any>;
    private getDaos;
    private throwIfUpdate;
}
