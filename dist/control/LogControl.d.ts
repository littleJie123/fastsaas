import Control from "./Control";
interface LogCdt {
    op: string;
    value?: any;
    col: string;
}
interface LogParam {
    day: string;
    cdts: LogCdt[];
}
/**
 * 查询日志文件
 */
export default class LogControl extends Control<LogParam> {
    private cdts;
    _getLogger(): any;
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    private getCdts;
    private checkJson;
    /**
     * 读取文件流 文件名为 `${filePath}/log${param.day}.log`或者`${filePath}/log${param.day}.log.gz`
     * 程序中需要先查询扩展名为log的，如果没有则查询扩展名为gz的文件
     * @param filePath
     */
    private readFileStream;
    /**
     * 逐行读取日志记录，每一行都是一个合法的json字符串，
     * 如果找到符合条件的200条则直接返回。
     * 读完文件也返回
     * @param fileStream
     * @param check
     */
    private readLines;
}
export {};
