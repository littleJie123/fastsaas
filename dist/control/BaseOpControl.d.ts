import Dao from './../dao/Dao';
import Control from './Control';
import RepeatChecker from '../checker/RepeatChecker';
import { Searcher } from '../fastsaas';
/**
 * 基本操作的对象
 */
export default abstract class extends Control {
    protected dataCdt: {
        get(): any;
        getOtherCdt(): any;
    };
    protected abstract getTableName(): string;
    protected getBaseDataCdt(): any;
    protected getNameCol(): string;
    protected getCheckNameMsg(): string;
    /**
     * 返回查询负责的dao
     */
    protected getDao(): Dao;
    protected getSearcher(): Searcher;
    getPkCol(): string;
    protected getPkData(): Promise<{
        [x: string]: any;
    }>;
    protected needCheckName(): boolean;
    /**
     * 创建单一检查的checker
     * @param col
     * @param msg
     * @returns
     */
    protected buildRepeatChecker(col: string, msg?: string, otherCdt?: any): RepeatChecker;
    getCheckers(): any[];
    getOtherCdt(): any;
    protected getData(): Promise<any>;
    getDataCdt(): any;
}
