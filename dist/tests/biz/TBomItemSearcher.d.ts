import Searcher from '../../searcher/Searcher';
import BaseInquiry from '../../searcher/inquiry/BaseInquiry';
import Context from '../../context/Context';
export default class TBomItemSearcher extends Searcher {
    protected init(context: Context): void;
    protected getKey(): string;
    getProduct(): BaseInquiry;
}
