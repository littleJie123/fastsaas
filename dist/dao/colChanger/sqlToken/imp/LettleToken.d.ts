import SqlToken from "../SqlToken";
export default class extends SqlToken {
    isEnd(c: string): boolean;
    /**
     * 返回标识符字段
     */
    getField(): string;
    /**
     * 直接返回新的 db 字段
     * @param dbField
     */
    changeByDbField(dbField: string): string;
}
