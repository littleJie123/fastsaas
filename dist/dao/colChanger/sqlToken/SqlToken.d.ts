export default abstract class {
    protected chars: string[];
    /**
     * 增加字符
     * @param c
     */
    add(c: string): void;
    protected getLastChar(): string;
    /**
     * 根据格式进行转化
     * @param pojoToDbMap
     */
    change(pojoToDbMap: {
        [key: string]: string;
    }): string;
    abstract isEnd(c: string): boolean;
}
