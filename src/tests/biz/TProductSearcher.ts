import Searcher from '../../searcher/Searcher';
import KeysInquiry from '../../searcher/inquiry/imp/KeysInquiry';
import Inquiry from '../../searcher/inquiry/imp/Inquiry';
import Context from '../../context/Context';
import Server from '../../context/decorator/Server';
@Server()
export default class ProductSearcher extends Searcher{
    
    protected init(context: Context) {

        this.reg('findProductMenu',new Inquiry({
            col:'product_menu_id',
            otherCdt:{
                is_del:0
            }
        }))      
        
        this.reg('findProductMenuNo',new KeysInquiry({
            keys:['product_no','product_menu_id'],
            otherCdt:{
                is_del:0
            }

        }))

        this.reg('findStore',new Inquiry({
            col:'store_id',
            otherCdt:{
                is_del:0
            }

        }))
    }   
    protected getKey(): string {
        return 'product'


    }
    async findStore(pmIds,col?){
        return await this.get('findStore').find(pmIds,col);
    }
    findProductMenu(pmIds,col?){
        return this.get('findProductMenu').find(pmIds,col);
    }

    findProductMenuNo(params,col?){
        return this.get('findProductMenuNo').find(params,col);
    }
}


