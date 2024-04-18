import Searcher from '../../searcher/Searcher';
import Inquiry from '../../searcher/inquiry/imp/Inquiry';
import BaseInquiry from '../../searcher/inquiry/BaseInquiry';
import KeysInquiry from '../../searcher/inquiry/imp/KeysInquiry';
import Context from '../../context/Context';
import Server from '../../context/decorator/Server';
@Server()
export default class TBomItemSearcher extends Searcher{
    protected init(context: Context) {
        this.reg('product',new Inquiry({col:'product_id'}));
    }    
    protected getKey(): string {
        return 't_bom_item'
    }

    getProduct(){
        return this.get('product');
    }


}