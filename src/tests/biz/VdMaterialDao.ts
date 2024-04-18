import MySqlDao from '../../dao/MySqlDao'
import Server from '../../context/decorator/Server';
@Server()
export default class VdMaterialDao extends MySqlDao{
    constructor(){
        super({
            tableName:'vd_material',
            ids:['id'],
            poolName:'vd'
        })
    }
    
}