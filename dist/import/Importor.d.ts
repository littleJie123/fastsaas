import { Context } from "../fastsaas";
import ImportorObj from "./dto/ImportorObj";
interface ImportOpt {
    /**
     * 默认值
     */
    defVal?: string;
    paramKeys?: string[];
    key: string;
    needId?: string[];
    /**
     * 不需要domain进行处理
     */
    noDomain?: boolean;
    /**
     * 结果数据不需要拼
     */
    noJoin?: boolean;
    /**
     * dao的process时候用
     */
    query?: any;
    /**
     * 其他列的数据
     */
    otherColMap?: any;
    /**
     * 更新
     */
    needUpdate?: boolean;
    checker?: (context: Context, param: any, datas: ImportorObj[]) => Promise<boolean>;
}
/**
 * 一个表的导入类
*/
export default class {
    opt: ImportOpt;
    constructor(opt: ImportOpt);
    /**
     * 转变数据
     * @param data
     * @param caolMap
     */
    change(oldData: any, newData: ImportorObj): void;
    checked(context: Context, param: any, datas: ImportorObj[]): Promise<boolean>;
    /**
     * 通过dao类来进行处理
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    protected checkByChecker(context: Context, param: any, datas: ImportorObj[]): Promise<boolean>;
    /**
     *
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    protected checkByDomain(context: Context, param: any, datas: ImportorObj[]): Promise<boolean>;
    /**
     * 处理导入
     * @param context
     * @param param
     * @param datas
     */
    process(context: Context, param: any, datas: ImportorObj[]): Promise<void>;
    /**
     * 将需要导入的数据转成pojo
     * @param param
     * @param data
     * @returns
     */
    protected parseDataToPojo(param: any, data: any): any;
    /**
     * 通过dao类来进行处理
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    protected processByDao(context: any, param: any, datas: ImportorObj[]): Promise<void>;
    /**
     * 将插入结果和内存中的数据进行关联，并且把id写进内存中的数据
     * @param datas
     * @param retArray
     * @returns
     */
    join(datas: ImportorObj[], retArray: any[]): void;
    protected getIdCol(): string;
    protected getIdColByKey(key: string): string;
    /**
     * 如果domain中实现了onImport方法，则通过import方法来调用
     * @param context
     * @param param
     * @param datas
     */
    processByDomain(context: Context, param: any, datas: ImportorObj[]): Promise<boolean>;
    getKey(): string;
    /**
     * 该列所有对应的数据为空
     * @param datas
     * @returns
     */
    isAllNull(datas: ImportorObj[]): boolean;
    isReady(datas: ImportorObj[]): boolean;
}
export {};
