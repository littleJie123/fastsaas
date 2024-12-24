type Message = number | string;
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
export default class LogHelp {
    private _opt;
    setSessionId(sessionId: string): void;
    constructor(opt?: LoggerOpt);
    setContextId(contextId: number): void;
    setCategory(category: string): void;
    infoObj(obj: any): void;
    ding(...message: Message[]): void;
    info(...message: Message[]): void;
    private changeMessageToObj;
    private getOpt;
    private print;
    private _acqLogType;
    error(...message: any): void;
    debug(...message: any): void;
}
export {};
