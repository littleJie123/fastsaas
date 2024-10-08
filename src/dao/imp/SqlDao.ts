import Dao from '../Dao';
import AddSql from '../builder/imp/sql/AddSql';
import AddArraySql from '../builder/imp/sql/AddArraySql'
import UpdateSql from '../builder/imp/sql/UpdateSql';
import UpdateArraySql from '../builder/imp/sql/UpdateArraySql'
import DelSql from '../builder/imp/sql/DelSql';
import DeleteArraySql from '../builder/imp/sql/DeleteArraySql'
import FindSql from '../builder/imp/sql/FindSql';
import FindCntSql from '../builder/imp/sql/FindCntSql';
import FindOneSql from '../builder/imp/sql/FindOneSql';
import FindByIdSql from '../builder/imp/sql/FindByIdSql'
import { DelByQuery } from '../builder/imp/sql';
import ImportArraySql from '../builder/imp/sql/ImportArraySql';

export default abstract class SqlDao<Pojo = any> extends Dao<Pojo> {


    protected _initMap() {
        return {
            add: AddSql,
            addArray: AddArraySql,
            update: UpdateSql,
            updateArray: UpdateArraySql,
            del: DelSql,
            delArray: DeleteArraySql,
            find: FindSql,
            findCnt: FindCntSql,
            findOne: FindOneSql,
            findById: FindByIdSql,
            delByQuery:DelByQuery,
            importArray:ImportArraySql
        }
    }




}