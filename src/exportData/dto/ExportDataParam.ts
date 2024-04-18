import Dao from '../../dao/Dao'

export default interface ExportDataParam{
    /**
     * 表的名称
     */
    tableName:string;
    dao:Dao;
    other?:OtherTable[];
    /**
     * 查询条件
     */
    query:any;
}
import OtherTable from './OtherTable'
