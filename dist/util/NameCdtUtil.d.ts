import { Context } from "vm";
import { Cdt } from "../dao/query/cdt/imp";
interface Opt {
    context: Context;
    key: string;
    value: string;
    /**
     * 其他查询条件
     */
    otherCdt?: any;
    /**
     * 操作符
     */
    op?: string;
    /**
     * name的字段名称，默认和key一样
     */
    colName?: string;
    /**
     * id的字段名称，默认xxx_id
     */
    idCol?: string;
}
export default class {
    /**
     * 根据名称到一个辅助表里面查询name，返回到主表做in的查询
     * @param context
     * @param key 必须是 `${tablename}_name`形式
     * @param value
     */
    static build(opt: Opt): Promise<Cdt>;
}
export {};
