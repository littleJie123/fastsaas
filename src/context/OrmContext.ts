import Context from './Context';
import TransManager from '../tans/TransManager'


export default class OrmContext{
    static regContext(context:Context){
        context.regClazz('TransManager',TransManager);
    }
}