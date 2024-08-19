/**
 *
 *
 */
export default class {
    private colName;
    private caseArray;
    private val;
    private sum?;
    isSum(): void;
    constructor(colName: any);
    toSql(): string;
    addCaseSql(caseSql: string, val: string): void;
    addValSql(colName: string, colval: any, val: string): void;
    addNullCol(colName: string, val: string): void;
    /**
     * else的值
     * @param elseValue
     */
    elseValue(elseValue: string): void;
    private buildWhen;
    buildElseSql(): string;
}
