/**
 * 打印日志
 */
interface LoggerOpt {
    context_id?: string | number;
    session_id?: string | number;
    store_id?: string | number;
    brand_id?: string | number;
    category?: string | number;
    other?: any;
    name?: string;
    url?: string;
    request_time?: number;
}
interface ForeverOpt {
    store_id?: string | number;
    brand_id?: string | number;
    oper_name: string;
    oper_param?: any;
    oper_time: string;
    user_id: string;
    user_type: 'eshine_user' | 'member_user' | 'brand_user';
}
export default class LogHelp {
    private static envName;
    private static levelMap;
    private static _projectName;
    private _level;
    private _opt;
    constructor(opt?: LoggerOpt);
    getProjectName(): string;
    set(opt: LoggerOpt): LogHelp;
    getLevelMap(): any;
    info(...message: any): void;
    infoObj(obj: any, message?: string): void;
    forever(opt: ForeverOpt): void;
    print(list: any, obj?: any): void;
    printObj(obj: any, message: string): void;
    getLevel(): string;
    /**
     * 每次一个新的对象，
     * 发挥opt的内容
     */
    getOther(): any;
    private _acqLogType;
    setLevel(level: string): LogHelp;
    setCategory(category: string): LogHelp;
    error(...message: any): void;
    debug(...message: any): void;
    red(...message: any): void;
    green(...message: any): void;
    yellow(...message: any): void;
    ding(...message: any): void;
    /**
     * 创建一个loghelp
     * @param req
     * @param opt
     */
    static buildLogger(req: any, opt?: LoggerOpt): LogHelp;
    static setProjectName(name: string): void;
    static setLevels(array: Array<string>): void;
    static setEnvName(envName: string): void;
}
export {};
