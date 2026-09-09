import SqlToken from "../SqlToken";
/**
 * 类似`dbcol`
 */
export default class extends SqlToken{
  /**
   * 返回反引号中的字段
   */
  getField(): string {
    return this.chars.slice(1, this.chars.length - 1).join('');
  }

  /**
   * 用新的 db 字段包上原来的反引号
   * @param dbField 
   */
  changeByDbField(dbField: string): string {
    let lastChar = this.getLastChar();
    let firstChar = this.chars[0];
    return `${firstChar}${dbField}${lastChar}`;
  }

  isEnd(c: string): boolean {
    return this.chars.length>1 && this.chars[0] == this.getLastChar();
  }
  
}