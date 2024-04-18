import MySqlDao from '../../dao/MySqlDao'
import Server from '../../context/decorator/Server';
@Server()
export default class TMaterialDao extends MySqlDao{
    constructor(){
        super({
            tableName:'material',
            ids:['id']
        })
    }
    
}