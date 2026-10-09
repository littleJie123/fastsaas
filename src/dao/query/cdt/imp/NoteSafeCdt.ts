/**
 * 调用方标明不做注入检查的条件。
 * 字段仍走 quoteField / changeSql，操作符按传入原文写入 SQL。
 * 不能用来承接客户端输入。
 */
import Cdt from './Cdt';

export default class NoteSafeCdt extends Cdt {
  protected resolveSqlOp(): string {
    return this.getOp();
  }
}
