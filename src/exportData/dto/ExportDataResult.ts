export interface TableResult{
    tableName:string;
    datas:any[];
}
export default class ExportDataResult{
    result:TableResult[];
}