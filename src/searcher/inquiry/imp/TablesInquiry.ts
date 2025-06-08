
import BaseInquiry from '../BaseInquiry'
import Searcher from './../../Searcher';
import {ArrayUtil} from './../../../util/ArrayUtil';
import BaseInquiryOpt from '../BaseInquiryOpt';

/**
 * 多表查询
 * {
 * }
 */
interface Opt extends BaseInquiryOpt{
	/**
	 * 其他表的字段，用来取值查询当前表，不指定的话，将取得所有数据作为多值查询
	 */
	otherCol?:string;
	/**
	 * 其他的表名
	 */
	otherTable?:string;
	/**
	 * 其他表的查询方法名称
	 */
	otherName?:string;
	/**
	 * 本表的查询方法名称
	 * 默认用findById查询
	 */
	name?:string;
}
export default  class TablesInquiry extends BaseInquiry{

	protected _opt: Opt;
	constructor(opt?:Opt){
		super(opt);
	}

   
    acqDataCode(data: any): string {
        throw new Error("不需要实现");
    }
    acqCode(param: any): string {
        throw new Error("不需要实现");
	}
	
	
    
	/**
	 * 第一步查询
	子类重写,从另外一个searcher 里面找
	*/
	protected  _findFromOtherSearcher(params):Promise<Array<any>>{
		
		
		let otherSearcher:Searcher = this.getSearcher(this.getOtherTable());
		return otherSearcher.get(this.getOtherName()).find(params);
		
	}



	protected getOtherTable(){
		let opt = this._opt;
		if(opt.otherTable == null){
			throw new Error('otherTable 没有指定');
		}
		return opt.otherTable;
	}

	protected getOtherName(){
		let opt = this._opt;
		if(opt.otherName == null){
			throw new Error('otherName 没有指定');
		}
		return opt.otherName;
	}

	protected _getName():string{
		var opt = this._opt;
		return opt.name;
	}

	protected  getSearcher<T>(key:string):T{
		var context = this.getContext();
		return context.get(key+'searcher');
	}

	protected _findArray (params:Array<any>):Promise<Array<any>> {
		
		if(this._couldSave()){
			return super._findArray(params)
		}else{
			return this._findFromDb(params);
		}
	}

	protected _parseOther(datas){
		let opt = this._opt;
		if(opt.otherCol == null){
			return datas;
		}
		return ArrayUtil.toArray(datas,opt.otherCol);
	}
	/**
	 * 做一个完整的查询
	 * @param params 
	 */
	protected async  _findFromDb (params:Array<any>):Promise<Array<any>> {
		
        if(!(params instanceof Array)){
            params = [params];
        }
		let otherDatas = await this._findFromOtherSearcher(params);
		let datas = this._parseOther(otherDatas);
		let list = await this._find(datas, params);
		list = this.combineData(list,otherDatas);
		return await this._addDefData(list, datas);
	}
	/**
	 * 合并两个表查询出来对数据
	 * @param list 主表的数据
	 * @param otherDatas 中间表的数据
	 */
	protected combineData(list:any[],otherDatas:any[]){
		return list
	}
	/**
	 * 第二步查询
	 * @param datas 从别的表查询出来的数据 
	 * @param opt  原始查询数据
	 */
	protected async _find(datas, opt) {
		if (datas == null || datas.length == 0)
			return [];
		var context = this.getContext();
		var searcher:Searcher = context.get(this.getKey()+'searcher');
		var name = this._getName();
		if (name == null) {
			return await searcher.findByIds(datas);
		} else {
			return await searcher.get(name).find(datas);
		}

	}

	acqDataFromCache(params,col?:string){
		if(this._couldSave()){
			return super.acqDataFromCache(params,col)
		}else{
			let otherSearcher:Searcher = this.getSearcher(this.getOtherTable());
			let list = otherSearcher.get(this.getOtherName()).acqDataFromCache(params);
			list = this._parseOther(list);
			return this._acqFromSearcherCache(list,col);
		}
	}

	protected  _acqFromSearcherCache(datas,col?:string){
		var context = this.getContext();
		var searcher:Searcher = context.get(this.getKey()+'searcher');
		var name = this._getName();
		if (name == null) {
			return  searcher.findByIdsFromCache(datas,col);
		} else {
			return  searcher.get(name).acqDataFromCache(datas,col);
		}
	}
	
	
	


	protected _couldSave():boolean {
		return false;
	}

}