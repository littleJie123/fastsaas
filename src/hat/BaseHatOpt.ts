import { BaseCdt, Context } from "../fastsaas";
/**
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 * 
 */
interface BaseHatOpt{
	context:Context;
	/**
	 * 分表的名称字段,默认name
	 */
	hatCol?:string;
	/**
	 * 给主表的名称字段 xxxName
	 */
	dataName?:string;
	/**
	 * 主表中分表的id，默认xxxId
	 */
	dataCol?:string;

	/**
	 * 表名，建议用驼峰式
	 */
	key?:string;
	/**
	 * 自定义的处理函数
	 * @param data 
	 * @param hatData 
	 * @returns 
	 */
	fun?:(data:any,hatData:any)=>Promise<void>|void
	
  /**
   * 整个obj拿过来
   */
  getObj?:boolean;
}
export default BaseHatOpt;