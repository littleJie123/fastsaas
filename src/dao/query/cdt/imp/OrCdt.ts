import JsonUtil from './../../../../util/JsonUtil';

import ArrayCdt from '../ArrayCdt'
import Sql from '../../../sql/Sql'
import BaseCdt from '../BaseCdt'
import ColChanger from '../../../colChanger/ColChanger'



export default class OrCdt extends ArrayCdt{
	toEs() {
		let q = {}
		for (let cdt of this._array) {
			JsonUtil.add(q, ['bool', 'should'], cdt.toEs()) 
		}
		return q
	}
	toSql(colChanger:ColChanger): Sql {
		return this.toSqlStr('or',colChanger);
	}
	isHit(obj) {
		var ret = false;
		for(var cdt of this._array){
			if(cdt.isHit(obj)){
				ret = true;
				break;
			}
		}
		return ret;
	}
}

