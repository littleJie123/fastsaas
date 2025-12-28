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
     * 结果数据不需要拼,使用dao来进行导入的时候用
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
    /**
     * domain中的函数名
     */
    domainFun?: string;
    /**
     * 不检查数据
     */
    noCheck?: boolean;
    /**
     * 纯数据，不需要处理
     */
    noProcess?: boolean;
}
/**
 * 一个表的导入类
*/
export default class Importor {
    private opt;
    private runned;
    getRunned(): boolean;
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
    private needProcessByDomain;
    private isEmptyDomainFun;
    /**
     * 处理导入
     * @param context
     * @param param
     * @param datas
     */
    process(context: Context, param: any, datas: ImportorObj[]): Promise<any>;
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
    private getDomain;
    /**
     * 如果domain中实现了onImport方法，则通过import方法来调用
     * @param context
     * @param param
     * @param datas
     */
    processByDomain(context: Context, param: any, datas: ImportorObj[]): Promise<boolean>;
    private getDomainFun;
    getKey(): string;
    /**
     * 该列所有对应的数据为空
     * @param datas
     * @returns
     */
    isAllNull(datas: ImportorObj[]): boolean;
    /**
     * 判断有没有运行
     * @param importors
     * @returns
     */
    private needAllRun;
    isReady(datas: ImportorObj[], importors: Importor[]): boolean;
}
export {};
