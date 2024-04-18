import EsOp from './EsOp'
export default class MatchEs extends EsOp{
    protected getTerm(col?:string,val?): string {
        
        return 'term';
    }

     
    
}