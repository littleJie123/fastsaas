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
   * 根据格式进行转化
   * @param pojoToDbMap 
   */
  change(pojoToDbMap: { [key: string]: string; }):string{
    return this.chars.join('')
  }

  abstract isEnd(c:string):boolean;
}