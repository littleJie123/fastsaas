import Context from './Context';


export default class MysqlContext{
    static regContext(context:Context){
        context.regComponent('DbTrans',MySqlTrans,'MySqlTrans')
    }
}
import MySqlTrans from '../dao/executor/status/MySqlTrans'

