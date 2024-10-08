import Control from './Control';
import Dao from './../dao/Dao';
/**
 * 处理单条数据
 */
export default abstract class DataControl extends Control {
    protected abstract _processData(data: any): Promise<any>;
    protected abstract _getNeedParamKey(): Array<string>;
    protected getTableName(): void;
    protected getDao(): Dao;
    doExecute(): Promise<any>;
    _createError(): Error;
    _findData(): Promise<any>;
}
