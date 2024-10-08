/**
 * 重复检查
 */
import Query from './../dao/query/Query';
import ColChecker from './ColChecker';
interface RepeatCheckerOpt {
    /**
     * 上下文
     */
    context: Context;
    /**
     * 检查属性 默认name
     */
    col?: string;
    /**
     * 错误号
     */
    code: string;
    /**
     * 其他条件
     */
    otherCdt?: any;
    /**
     * 表格名称
     */
    key: string;
    /**
     * 检查array字段
     */
    isArray?: boolean;
}
export default class RepeatChecker extends ColChecker {
    _opt: any;
    constructor(opt: RepeatCheckerOpt);
    _initOpt(opt: any): any;
    _createMsg(): any;
    _createError(param: any, col: any): Promise<Error>;
    getContext(): Context;
    check(param: any): Promise<void>;
    checkUpdate(param: any): Promise<void>;
    protected getIdCol(): string;
    checkAdd(param: any): Promise<void>;
    getDao(): Dao<any>;
    _check(value: any, col: any, param: any): Promise<boolean>;
    protected _buildQuery(value: any, col: any, param: any): Query;
    getCol(): any;
}
import Dao from './../dao/Dao';
import Context from './../context/Context';
export {};
