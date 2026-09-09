import SqlToken from "../SqlToken";
import SqlTokenUtil from "../SqlTokenUtil";

export default class extends SqlToken {
  isEnd(c: string): boolean {
    return !SqlTokenUtil.isNumber(c) && !SqlTokenUtil.isLetter(c); 
  }

  /**
   * 返回标识符字段
   */
  getField(): string {
    return this.chars.join('');
  }

  /**
   * 直接返回新的 db 字段
   * @param dbField 
   */
  changeByDbField(dbField: string): string {
    return dbField;
  }
}