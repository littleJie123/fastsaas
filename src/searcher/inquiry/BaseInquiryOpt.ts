import { Context } from "../../fastsaas";
import BaseCache from "./cache/BaseCache";

export default interface BaseInquiryOpt {
  keyFun?(param: any):string;
	findDefDatas?(notOpt: any[], list: any): any[];
  schCols?: string[];
  col?:string;
  keys?:string[]
  cache?:BaseCache;
  context?:Context;
  onlyDate?:boolean;
  otherCdt?:any
  key?:string;
}