import Searcher from '../../searcher/Searcher';
import BaseInquiry from '../../searcher/inquiry/BaseInquiry';
import Context from '../../context/Context';
export default class TMaterialSearcher extends Searcher {
    protected getKey(): string;
    getIdKey(): string;
    protected init(context: Context): void;
    getBrand(): BaseInquiry;
    getBrandName(): BaseInquiry;
    getProduct(): BaseInquiry;
}
