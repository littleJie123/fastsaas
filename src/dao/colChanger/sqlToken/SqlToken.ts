export default abstract class {
  protected chars:string[] = []; 
  /**
   * 增加字符
   * @param c 
   */
  add(c: string) {
    this.chars.push(c)
  }

  protected getLastChar(){
    return this.chars[this.chars.length-1]
  }
  /**
   * 返回原始 sql 片段
   */
  toSql(): string {
    return this.chars.join('');
  }

  /**
   * 是否需要更改字段
   */
  needChange(): boolean {
    return this.getField() != null;
  }

  /**
   * 返回需要更改的字段，不需要更改则返回 null
   */
  getField(): string {
    return null;
  }

  /**
   * 将新的 db 字段组成合适的 sql
   * @param dbField 
   */
  changeByDbField(dbField: string): string {
    return this.toSql();
  }

  abstract isEnd(c:string):boolean;
}