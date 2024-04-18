
import path from 'path'
import FileContext from '../context/FileContext';
import ConfigFac from '../config/ConfigFac';
import OrmContext from '../context/OrmContext';
import MysqlContext from '../context/MysqlContext'

function init() {
    ConfigFac.init(path.join(__dirname, '../../tests/json'))
    var fileContext = new FileContext()
    fileContext.loadFromPath(path.join(__dirname,'./biz'));
    OrmContext.regContext(fileContext)
    MysqlContext.regContext(fileContext);
    var context = fileContext.buildChild();
    return context;
}


export default function(){
    return init();
}