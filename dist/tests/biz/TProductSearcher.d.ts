import Searcher from '../../searcher/Searcher';
import Context from '../../context/Context';
export default class ProductSearcher extends Searcher {
    protected init(context: Context): void;
    protected getKey(): string;
    findStore(pmIds: any, col?: any): Promise<any>;
    findProductMenu(pmIds: any, col?: any): Promise<any>;
    findProductMenuNo(params: any, col?: any): Promise<any>;
}
