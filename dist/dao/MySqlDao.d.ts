import SqlDao from './imp/SqlDao';
import IExecutor from './executor/IExecutor';
import { Query } from '../fastsaas';
export default class MySqlDao<Pojo = any> extends SqlDao<Pojo> {
    protected _executor: IExecutor;
    protected _acqExecutor(): IExecutor;
    /**
     * 根据多个查询查找
     * @param querys
     * @returns
     */
    findByQuerys(querys: Query[]): Promise<Pojo[]>;
}
