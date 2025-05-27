/*
 * @Author       : kaikai.hou
 * @Email        : kaikai.hou@downtown8.com
 * @Description  : Balabala
 * @Date         : 2020-02-25 17:26:18
 * @LastEditors  : kaikai.hou
 * @LastEditTime : 2020-02-28 17:55:06
 */

import Sql from './Sql'
import { sqlType } from '../../constant'

/**
 * 1. 每种 sql, 对于 value 的占位符并不相同, mysql: ? pg: $num
 */
export default class ValSql extends Sql {
  private val: any

  /**
   * @description sql 参数化处理
   * @param val
   */
  constructor(val) {
    super()
    this.val = val
    if (this.val instanceof Array && !this.val.length) this.val = [false]
  }

  /**
   * @description sql 参数化处理
   * @param type
   * @param count
   */
  toSql(): string {
    let res = ''
    if (this.val instanceof Array) {
      let resArray = [];
      let vals = this.val
      for (let _val of vals) {
        resArray.push(this.parseValueSql(_val))
      }
      res = ['(', resArray.join(','), ')'].join('');
    } else {
      res = '?'
    }
    return res
  }


  private parseValueSql(val: any): string {
    if(val instanceof Array){
      let array = Array(val.length).fill('?');
      return `(${array.join(',')})`
    }else{
      return '?'
    }
  }

  toVal(): any {
    // TODO: value 转义
    if (this.val instanceof Array) {
      let array = []
      for (let _val of this.val) {
        if(_val instanceof Array){
          array.push(... _val)
        }else{
          array.push(_val)
        }
        
      }
      return array;
    }
    return [this.val]
  }

  /**
   * @description sql 中的一个 value, 不支持 add, 一个 value 一个实例
   */
  add(): Sql { return this }
}