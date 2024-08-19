import JointWiget from "../JointWiget";
/**
 * 执行函数的联合表
 */
export default class extends JointWiget {
    protected params: {
        key: string;
        value: any;
    }[];
    protected find(): Promise<any[]>;
    addParam(key: string, value: any, cdtFun: Function): Promise<void>;
}
