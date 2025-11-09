interface SplitRes {
    str: string;
    keyword?: string;
    [prop: string]: any;
}
/**
 * 字符串处理类
 */
export declare class StrUtil {
    /**
     * 将一个下划线的字符串转成驼峰式
     * @param str
     */
    static changeUnderStringToCamel(str: string): string;
    /**
     * 将一个对象的属性 从驼峰转下划线
     * @param obj
     */
    static camelToUnder(obj: any): any;
    /**
     * 将一个对象的属性 从下划线到驼峰
     * @param obj
     */
    static underToCamel(obj: any): any;
    /**
     * 首字母小写
     */
    static firstLower(str: string): string;
    static firstUpper(str: string): string;
    static pasical(name: string): string;
    static firstUpperPasical(name: string): string;
    static removeExtName(str: string): string;
    static pad(num: any, n: any): string;
    static isEmpty(str: any): boolean;
    /**
    替换字符串,会替换所有
    */
    static replace(str: string, substr: string, replacement: string): string;
    static start(str: string, prefix: string, noCase?: boolean): boolean;
    static startIngoreCase(str: string, prefix: string): boolean;
    static end(str: string, suffix: string, noCase?: boolean): boolean;
    static trim(str: string): string;
    static split(str: string | Array<string>, array: Array<string>): Array<string>;
    /**
     * 可以通过多个key进行split，防止类似全角的；和;都可以应用
     */
    static splitKeys(str: string, keys: Array<string>): Array<string>;
    /**
    判断是否字符串
    */
    static isStr(str: any): boolean;
    static trimList(list: any): Array<string>;
    /**
     *
     * @param strs
     * @param key
     */
    static join(strs: Array<any>, key?: string): string;
    /**
     * 根据keyword里面的数组，将一个字符串转成一个数组
     * 例如 aa+bb-cc 转成[{str:"aa",keyword:"+"},{str:"bb",keyword:"-"},{str:"cc"}]的数组
     *
     * @param str
     * @param keyword
     */
    static splitToArray(str: string, keyword: string | string[]): SplitRes[];
    /**
     * 格式化sql
     * @param sql
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static formatSql(sql: string, obj: any): {
        sql: string;
        params?: any[];
    };
    /**
     * 格式化sql
     * @param strFormat
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static format(strFormat: string, obj: any): string;
}
export {};
