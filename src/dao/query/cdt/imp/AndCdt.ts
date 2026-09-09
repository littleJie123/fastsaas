import ArrayCdt from '../ArrayCdt'
import Sql from '../../../sql/Sql'
import JsonUtil from './../../../../util/JsonUtil';
import IColChanger from '../../../colChanger/IColChanger';
export default class AndCdt extends ArrayCdt   {
  toSql(colChanger:IColChanger): Sql {
    return this.toSqlStr('and',colChanger);
  }
  toEs() {
    let q = {}
    for (let cdt of this._array) {
      JsonUtil.add(q,['bool', 'must'],cdt.toEs());
    }
    return q
  }
  isHit(obj) {
    var ret = true;
    for (var cdt of this._array) {
      if (!cdt.isHit(obj)) {
        ret = false;
        break;
      }
    }
    return ret;
  }
}