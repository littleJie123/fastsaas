import { ArrayUtil } from '../util/ArrayUtil';
import ListControl from '../control/ListControl';
import Dao from '../dao/Dao';

export interface SchIdsOpt {
  /**
   * 从 result.content 读取的属性；needObj 为 true 时不需要
   */
  col?: string;
  /**
   * 查询对象的类（通常为 ListControl 子类）
   */
  control: new (...args: any[]) => any;
  /**
   * 查询结果写到目标 param 的字段名
   */
  targetCol: string;
  /**
   * true：把 content 整表设到 targetCol；false：抽 col（或主键）成 id 数组
   */
  needObj?: boolean;
}

/**
 * 分页全选：用 `_schParam` 按列表查询条件拉全量 id（或对象），写入 targetCol。
 * 见 doc/分页选择.md
 */
export default function SchIds(opt: SchIdsOpt) {
  return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      async _parseRequestParam(req?: Request, resp?: Response): Promise<any> {
        let param = this['_param'];
        if (param != null && param._schParam != null) {
          let context = this['_context'];
          let ctrl: ListControl = new opt.control();
          if (ctrl.setContext) {
            ctrl.setContext(context);
          }
          if (context != null) {
            context.assembly([ctrl]);
          }
          param._schParam._onlyId = true;
          let result = await ctrl.executeParam(param._schParam, req as any, resp as any);
          let content = result?.content ?? [];
          if (opt.needObj) {
            param[opt.targetCol] = content;
          } else {
            let col = opt.col;
            if (col == null) {
              let dao: Dao = (ctrl as any).getDao();
              col = dao.getPojoIdCol();
            }
            param[opt.targetCol] = ArrayUtil.toArray(content, col);
          }
        }
        let superParse = super['_parseRequestParam'];
        if (superParse) {
          return await superParse.call(this, req, resp);
        }
      }
    } as any
  }
}
