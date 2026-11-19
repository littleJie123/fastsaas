import { createHash } from "crypto";
import { ArrayUtil } from "./ArrayUtil";
import NumUtil from "./NumUtil";

interface FeatureCodeOpt{
  pkCol:string;//主键，数组需要按这个进行排序
  cols?:string[] //其他列 要考虑值为浮点数的情况
}

/**
 * 数字编码前保留的小数位。和 NumUtil.isEq 的 0.000001 对齐。
 */
const S_FloatLen = 6

export default class FeatureCodeUtil{
  /**
   * 计算写入库的特征码。先算明文，再做 md5，结果是 32 位十六进制。
   * 没有行时明文为空字符串，特征码是空字符串的 md5，不返回 null。
   */
  static buildCode(list:any[],opt:FeatureCodeOpt):string{
    return this.encrypt(this.buildPlain(list, opt))
  }

  /**
   * 计算特征码明文。
   * 按 pkCol 升序后，把主键和 cols 拼成字符串。没有行时返回空字符串。
   * 数字先格式化成 6 位小数，避免 3.9999999999 和 4 编出不同的明文。
   */
  static buildPlain(list:any[],opt:FeatureCodeOpt):string{
    if (list == null || list.length == 0) {
      return ''
    }
    let rows = list.slice()
    ArrayUtil.order(rows, opt.pkCol)
    let cols = opt.cols ?? []
    let lines: string[] = []
    for (let row of rows) {
      let cells: string[] = [this.formatCell(row?.[opt.pkCol])]
      for (let col of cols) {
        cells.push(this.formatCell(row?.[col]))
      }
      lines.push(cells.join(','))
    }
    return lines.join(';')
  }

  /**
   * 按明文计算 md5，十六进制，长度 32。
   */
  static encrypt(plain: string): string {
    return createHash('md5').update(plain ?? '', 'utf8').digest('hex')
  }

  /**
   * 数字收成固定小数再转文本。空值返回空字符串。
   */
  private static formatCell(value: any): string {
    if (value == null || value === '') {
      return ''
    }
    if (typeof value == 'number') {
      if (isNaN(value)) {
        return ''
      }
      return NumUtil.toNum(value, S_FloatLen).toFixed(S_FloatLen)
    }
    return String(value)
  }
}