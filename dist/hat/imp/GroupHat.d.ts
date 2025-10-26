import Hat from './Hat';
import BaseCdt from '../../dao/query/cdt/BaseCdt';
import Query from './../../dao/query/Query';
import BaseHatOpt from '../BaseHatOpt';
interface GroupHatOpt extends BaseHatOpt {
    /**
     * 其他查询条件
     */
    otherCdt?: BaseCdt;
}
/**
 * _acqGroup //group 字段
 * acqCol //返回的查询字段
 * async _acqOtherCdt // 返回的其他字段
 * 通过group查询的帽子
 */
export default abstract class GroupHat extends Hat {
    protected _opt: GroupHatOpt;
    protected abstract acqDataCol(): string;
    constructor(opt: GroupHatOpt);
    protected _schMap(list: any): Promise<{
        [key: string]: any;
    }>;
    protected _toMap(array: any): {
        [key: string]: any;
    };
    _processData(data: any, hatData: any): void;
    /**
     * 返回列
     */
    protected acqCol(): string[];
    /**
     * 返回group字段
     */
    protected _acqGroup(): string[];
    protected _buildQuery(list: any): Promise<Query>;
    protected _acqOtherCdt(list: any): Promise<BaseCdt>;
    protected _acqDefData(data: any): {
        [x: string]: any;
        cnt: number;
    };
}
export {};
