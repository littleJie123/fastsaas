import Context from './../../context/Context';
import JointOpt from "../opt/JointOpt";
export default abstract class {
    protected opt: JointOpt;
    protected context: Context;
    /**
     * 返回主表的列
     * @returns
     */
    getCol(): string;
    setOpt(opt: JointOpt): void;
    setContext(context: Context): void;
    addData(datas: any[]): Promise<any[]>;
    /**
     * paramkey中是否包含指定值
     * @param key
     * @returns
     */
    isIncludeKey(key: string): boolean;
    /**
     * 从数据库的表查询
     */
    protected abstract find(): Promise<any[]>;
    /**
     * 增加值
     * @param key
     * @param value
     * @param fun
     */
    abstract addParam(key: string, value: any, cdtFun: Function): Promise<void>;
}
