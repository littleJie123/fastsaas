import TablesInquiry from '../../../searcher/inquiry/imp/TablesInquiry';
import TBomItemSearcher from '../TBomItemSearcher'

export default class ProductInquiry extends TablesInquiry{
    protected async _findFromOtherSearcher(params: any) {
        let bomItemSearcher = this.getSearcher<TBomItemSearcher>('tbomItem');
        return await bomItemSearcher.getProduct().find(params,'material_id');
    }

}