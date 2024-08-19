import { Context } from "../fastsaas";
interface BaseHatOpt {
    context: Context;
    /**
     * 分表的名称字段,默认name
     */
    hatCol?: string;
    /**
     * 给主表的名称字段 xxxName
     */
    dataName?: string;
    /**
     * 主表中分表的id，默认xxxId
     */
    dataCol?: string;
    /**
     * 表名，建议用驼峰式
     */
    key?: string;
    /**
     * 自定义的处理函数
     * @param data
     * @param hatData
     * @returns
     */
    fun?: (data: any, hatData: any) => Promise<void> | void;
    /**
     * 整个obj拿过来
     */
    getObj?: boolean;
}
export default BaseHatOpt;
