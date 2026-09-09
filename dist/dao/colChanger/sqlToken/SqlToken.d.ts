export default abstract class {
    protected chars: string[];
    /**
     * 增加字符
     * @param c
     */
    add(c: string): void;
    protected getLastChar(): string;
    /**
     * 返回原始 sql 片段
     */
    toSql(): string;
    /**
     * 是否需要更改字段
     */
    needChange(): boolean;
    /**
     * 返回需要更改的字段，不需要更改则返回 null
     */
    getField(): string;
    /**
     * 将新的 db 字段组成合适的 sql
     * @param dbField
     */
    changeByDbField(dbField: string): string;
    abstract isEnd(c: string): boolean;
}
