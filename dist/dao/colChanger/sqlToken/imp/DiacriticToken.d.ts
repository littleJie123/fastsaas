import SqlToken from "../SqlToken";
/**
 * 类似`dbcol`
 */
export default class extends SqlToken {
    /**
     * 返回反引号中的字段
     */
    getField(): string;
    /**
     * 用新的 db 字段包上原来的反引号
     * @param dbField
     */
    changeByDbField(dbField: string): string;
    isEnd(c: string): boolean;
}
