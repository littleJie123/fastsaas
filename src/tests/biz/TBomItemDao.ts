import MySqlDao from '../../dao/MySqlDao'
import Server from '../../context/decorator/Server';
@Server()
export default class TBomItemDao extends MySqlDao{
    constructor(){
        super({
            tableName:'bom_item',
            ids:['id']
        })
    }
}