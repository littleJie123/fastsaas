
export default interface OtherTable{
    tableName:string;
    /**
     * 主键列名
     */
    col?:string;
    dao:Dao;
    /**
     * 依赖其他表
     */
    depency?:ExportDepency[];
    otherCdt?:any;
}
import Dao from '../../dao/Dao'
import ExportDepency from './ExportDepency'

