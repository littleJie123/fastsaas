import SqlDao from './imp/SqlDao';
import IExecutor from './executor/IExecutor';
import MySqlExecutor from './executor/MySqlExecutor'


export default class MySqlDao<Pojo = any> extends SqlDao<Pojo> {
    protected _executor:IExecutor;
    protected _acqExecutor(): IExecutor {
        let context =  this.getContext();
        if(this._executor == null){
            var opt = this._opt;
            let mysqlExecutor;
            mysqlExecutor = new MySqlExecutor(opt)
            mysqlExecutor.setContext(context);
            this._executor =  mysqlExecutor;
          
        }
        return this._executor;
    }

}

