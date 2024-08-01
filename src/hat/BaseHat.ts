
/**
 * 帽子的父类
 */
import { BaseCdt } from '../fastsaas';
import Context from './../context/Context';
import BaseHatOpt from './BaseHatOpt';

export default abstract class BaseHat{
	protected _opt:BaseHatOpt;
	protected _fun:(data:any,hatData:any)=>Promise<void> | void;
	constructor(opt:BaseHatOpt) {
		if (opt == null) {
			opt = <any>{}
		}
		this._opt = opt
		if (opt.fun) {
			this._fun = opt.fun
		}
		
	}
	abstract  process(list:Array<any>):Promise<Array<any>>;

	protected getContext():Context{
		return this._opt.context
	}

	async processOne(row){
		var array = await this.process([row])
		return array[0];
	}
}