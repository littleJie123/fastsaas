

import EsOp from './EsOp'
import {StrUtil} from '../../../util/StrUtil'

export default class LikeEs extends EsOp{
    protected getTerm(col?:string,val?): string {
        return null
    }

    toEs(col:string,val?){
        //let regExp = new RegExp(val, 'i');
        if(val != null)
            val = StrUtil.replace(val,'%','*')
        return {
            wildcard: {
                [col]: val
            }
        };
    }
     
    
}