import SqlToken from "./sqlToken/SqlToken";
export default class {
    private dbToPojoMap;
    private pojoToDbMap;
    private clazz;
    /**
     * 一个db的field为key，pojo属性为value的map
     * @param dbToPojoMap
     */
    constructor(dbToPojoMap: {
        [key: string]: string;
    }, clazz?: any);
    /**
     * 是否有效的key
     * @param col
     */
    isValid(col: string): boolean;
    /**
     * 将db的字段转成pojo的字段
     * @param col
     * @returns
     */
    parseDbField(col: string): string;
    /**
     * 将一个内存字段转成db中的字段
     * @param pojoField 内存中的字段
     */
    parsePojoField(pojoField: string): string;
    /**
     * 将内存的字段数组转成db的字段
     * @param pojoFields 内存中的字段
     */
    parsePojoFieldsToDbFields(pojoFields: string[]): string[];
    /**
     * 把一个字段为pojo属性的sql ，转成数据库的sql
     */
    changeSql(sql: string): string;
    scanTokens(sql: string): SqlToken[];
    /**
     * 把从db里面查询出来的对象转成内存
     */
    changeDb2Pojo(data: any): any;
    /**
     * 将一个数组的数据库对象转成内存的数组
     */
    changeDbArray2Pojo(array: any[]): any[];
}
