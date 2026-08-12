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
 * 查询日志文件。
 * 支持按日切割的多文件：log{day}.log、log{day}.log.N、log{day}.log.N.gz，
 * 从序号最大的分片开始遍历（最旧 → 最新），汇总最近匹配的 200 条。
 */
export default class LogControl extends Control<LogParam> {
    private cdts;
    _getLogger(): any;
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    private getCdts;
    private checkJson;
    /**
     * 列出某日全部日志分片，按序号从大到小排序（最大序号最先读）。
     * 同序号同时存在 .log.N 与 .log.N.gz 时优先非压缩文件。
     */
    private findLogFiles;
    private escapeRegExp;
    /**
     * 从流头开始逐行匹配，写入环形缓冲；返回更新后的匹配总数。
     */
    private appendMatchingFromStart;
    /**
     * 将环形缓冲整理为「最新在前」的数组（最多 MAX_LINES 条）。
     */
    private reorderCircularBuffer;
}
export {};
