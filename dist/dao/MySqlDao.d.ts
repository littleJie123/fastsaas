import SqlDao from './imp/SqlDao';
import IExecutor from './executor/IExecutor';
export default class MySqlDao<Pojo = any> extends SqlDao<Pojo> {
    protected _executor: IExecutor;
    protected _acqExecutor(): IExecutor;
}
