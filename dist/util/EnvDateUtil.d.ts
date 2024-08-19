/**
 * 根据base.json的环境变量来确定
 */
export default class {
    static test(): void;
    static timezoneToSysDate(date: Date, timezone?: string): Date;
    /**
     * 由于存的都是时区别名，做一层转换。
     */
    private static _parseTimezone;
}
