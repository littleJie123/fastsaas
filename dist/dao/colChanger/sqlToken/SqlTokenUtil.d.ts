export default class {
    /**
     * 是否空字符串
     * @param c
     */
    static isSpace(c: string): boolean;
    /**
     * 是否字母
     * @param c
     * @returns
     */
    static isLetter(c: string): boolean;
    /**
     * 是否数字
     * @param c
     * @returns
     */
    static isNumber(c: string): boolean;
    /**
     * 是否重音符
     * @param c
     */
    static isDiacritic(c: string): c is "`";
    /**
     * 单引号
     * @param c
     * @returns
     */
    static isSingleQuote(c: string): c is "'";
    /**
     * 单引号
     * @param c
     * @returns
     */
    static isDoubleQuote(c: string): c is "'";
}
