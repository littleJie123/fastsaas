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
     * Finds the log file, preferring .log over .log.gz.
     * @param dirPath The directory containing log files.
     * @returns An object with the file path and a flag indicating if it's gzipped, or null if not found.
     */
    private findLogFile;
    /**
     * Reads a stream line by line from the beginning. Used for gzipped files.
     * It uses a fixed-size buffer to store only the last 200 matching lines, preventing OOM.
     */
    private readLinesFromStart;
    /**
     * Reads a file line by line from the end. Used for plain text .log files.
     * Stops after finding 200 matching lines. This is memory-efficient for large files.
     */
    private readLinesBackwards;
}
export {};
