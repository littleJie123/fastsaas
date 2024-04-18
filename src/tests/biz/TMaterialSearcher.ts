import Searcher from '../../searcher/Searcher';
import Inquiry from '../../searcher/inquiry/imp/Inquiry';
import BaseInquiry from '../../searcher/inquiry/BaseInquiry';
import KeysInquiry from '../../searcher/inquiry/imp/KeysInquiry';
import Context from '../../context/Context';
import Server from '../../context/decorator/Server';

import ProductInquiry from './inquiry/ProductInquiry';
import ClazzUtil from '../../util/ClazzUtil';

@Server()
export default class TMaterialSearcher extends Searcher{
    protected getKey(): string {
        return "TMaterial";
    }
    getIdKey(){
        return 'id';
    }
    protected init(context:Context) {
        

        this.reg('brand',ClazzUtil.combine(new Inquiry({
            col:'brand_id',
            otherCdt:{is_del:0}
        }),{
            _findDefDatas(array:Array<any>){
                var list = [];
                for(var brand_id of array){
                    list.push({brand_id,name:'默认物料'});
                }
                return list;
            }
        }));

        this.reg('name',new Inquiry({
            col:'name'
        }))

        this.reg('brandName',new KeysInquiry({
            keys:['brand_id','name']
        }))

        this.reg('product',new ProductInquiry());
    }
    
    getBrand():BaseInquiry{
        return this.get('brand');
    }

    getBrandName():BaseInquiry{
        return this.get('brandName')
    }

    getProduct():BaseInquiry{
        return this.get('product');
    }


    
}