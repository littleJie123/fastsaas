/**
 * 用来导出数据
 */
export default class ExportData {
    export(param: ExportDataParam): Promise<ExportDataResult>;
    private _exportMain;
    private _exportOther;
    private _acqIdsFromDatas;
    private _acqDatasByTableName;
    private _acqDefIdCol;
}
import ExportDataParam from "./dto/ExportDataParam";
import ExportDataResult from "./dto/ExportDataResult";
