import Server from '../../context/decorator/Server';
import MySqlDao from '../../dao/MySqlDao'
import SortCol from '../../decorator/SortCol';
@Server()
@SortCol()

export default class ProductDao extends MySqlDao{
    constructor(){
        super({
            tableName:'product',
            poolName:'cloud',
            ids:['product_id']
        })
    }
}