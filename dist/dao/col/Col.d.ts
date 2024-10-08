import Formula from './../../formula/Formula';
export default class Col {
    private _colName;
    private _name;
    private _formula;
    constructor(str?: string);
    parse(str: any): void;
    /**
    为havingcol
    */
    parseHavingCol(cdt: Cdt): void;
    private _parseColName;
    private _startWithCount;
    private _parseCount;
    /**
     *
     */
    getName(): string;
    /**
     * as 前面的东西
     */
    getColName(): string;
    /**
    读取es的查询结果集合
    */
    parseEsHitResult(data: any, row: any): void;
    /**
    读取ess 的 agg result
    */
    parseEsAggResult(data: any, row: any): void;
    acqFormula(): Formula;
    acqFormulaString(): any;
    toString(): string;
    /**
     * 有没有聚合函数
     */
    hasAgg(): boolean;
    /**
    设置查询es的时候的egg
    */
    parseEsAgg(param: any): any;
    parseEsGroupParam(param: any): {
        terms: {
            size: number;
        };
    };
    toEsGroupParam(): {
        [x: number]: {
            terms: {
                size: number;
            };
        };
    };
    /**
    设置es 的group查询的select 后面的col

    */
    parseEsGroupSchCol(param: any): void;
    parseEsHaving(param: any): string;
    /**
     * 从一条记录中读取字段
     * @param obj
     */
    toValue(obj: any): any;
    calList(list: any[]): any;
    clone(): Col;
}
import { Cdt } from '../query/cdt/imp';
