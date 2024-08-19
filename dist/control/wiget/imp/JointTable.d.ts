import BaseCdt from './../../../dao/query/cdt/BaseCdt';
import JointWiget from "../JointWiget";
export default class extends JointWiget {
    protected cdts: BaseCdt[];
    protected find(): Promise<any[]>;
    addParam(key: string, value: any, cdtFun: Function): Promise<void>;
}
