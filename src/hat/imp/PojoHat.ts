import { ArrayUtil, Context, Dao, Searcher, StrUtil } from "../../fastsaas";
import Hat from "./Hat"
interface Opt {
  key: string;
  context: Context;
  cols?: string[];
  fun?(data, hatData);
}
/**
 * 与hat的不同是，在主表中产生的数据是对象，不再只是name
 * 主表：内存中的数据，data为前缀
 * 分表：数据库中的数据，hat为前缀
 */
export default class PojoHat {
  private opt: Opt;
  constructor(opt: Opt) {
    this.opt = opt;
  }

  async process(list: any[]) {
    let context = this.opt.context;
    let searcher: Searcher = context.get(this.opt.key + 'Searcher');
    let pkCol = this.getPkCol();
    let key = this.opt.key
    let dbList = await searcher.findByIds(
      ArrayUtil.toArrayDis(list, pkCol)
    )
    let cols = this.getCols()
    ArrayUtil.join({
      list,
      list2: dbList,
      key: pkCol,
      fun: (data, data2) => {
        let ret: any = { [pkCol]: data2[pkCol] }
        for (let col of cols) {
          ret[col] = data2[col]
        }
        data[key] = ret;
      }
    })

  }

  protected getCols(): string[] {
    return this.opt.cols ?? ['name'];
  }

  protected getPkCol() {
    return StrUtil.firstLower(this.opt.key + 'Id');
  }

}