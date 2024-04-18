/**
 * 普通的查询
 * 
 */
import BaseEsFind from './BaseEsFind'
import Query from './../../query/Query';
import {BeanUtil} from './../../../util/BeanUtil';


export default class extends BaseEsFind{
    
    parseResult(query:Query,result:any){
        let logger = this.getContext().getLogger('esDao')
        let list:any[] = result?.hits?.hits;
        if(list == null){
            
            
            return []
        }
        
        logger.debug('查询数量：'+list.length)
        return list.map(row=>{
            let data:any = {};
            let source = row._source
            data.id = row._id;
            let cols = query.acqCol();
            if(cols != null && cols.length>0){
                for(let col of cols){
                    col.parseEsHitResult(data,source)
                }
            }else{
                BeanUtil.copy(source,data)
            }
            return data;
        })
    }
}

