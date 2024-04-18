import {BeanUtil} from './BeanUtil';
import {DateUtil} from './DateUtil';
import Bean from './../context/decorator/Bean';

function process(data ,key,val){
    if(val != null && val instanceof Date ){
        data[key] = DateUtil.formatDate(val);
        
    }
    if(val == null){
        delete data[key]
    }
    
}
export default BeanUtil.eachFun(process);
