import Inquiry from "./Inquiry";
import Searcher from './../../Searcher';
import Query from './../../../dao/query/Query';
import BaseInquiry from './../BaseInquiry';
import { ArrayUtil } from './../../../util/ArrayUtil';
import BaseInquiryOpt from "../BaseInquiryOpt";
interface Opt extends BaseInquiryOpt {
  funName?:string
  fun?(param:any):boolean;
  otherCdt?:any
}

export default class ProxyInquiry extends Inquiry {
  protected _opt:Opt;
  couldSaveAll() {
    return false
  }

  _couldSave() {
    return false
  }
  async find(param, col?) {
    if (param == null)
      return [];
    if (!(param instanceof Array)) {
      param = [param]
    }
    if (param.length == 0)
      return [];
    var context = this.getContext();
    var list;
    var opt = this._opt;
    var searcher: Searcher = context.get(this.getKey() + 'searcher');
    if (opt.funName) {

      var opt = this._opt;
      list = await searcher[opt.funName](param);
    } else {

      list = await searcher.findByIds(param);
    }

    let retList = this._filter(list)
    if (col != null)
      retList = ArrayUtil.toArray(retList, col)
    return retList;
  }
  protected _filter(list) {
    var opt = this._opt;
    if (opt.fun) {
      return ArrayUtil.filter(list, opt.fun);
    }
    if (opt.otherCdt) {
      let array = []
      var otherCdt = this.acqOtherCdt()
      var query = Query.parse(otherCdt);
      for (let row of list) {
        if (query.isHit(row)) {
          array.push(row)
        }
      }
      return array;

    }
    return list;

  }

  acqDataFromCache(param) {
    let context = this.getContext();
    var searcher: Searcher = context.get(this.getKey() + 'searcher');
    let inquiry: BaseInquiry = null;
    if (opt.funName) {
      var opt = this._opt;
      inquiry = searcher.get(opt.funName)

    } else {
      inquiry = searcher.get('getById')

    }
    let list = inquiry.acqDataFromCache(param);
    return this._filter(list);
  }
}