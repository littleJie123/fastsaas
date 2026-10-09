
import IColChanger from '../../colChanger/IColChanger';
import Sql from '../../sql/Sql'

export default abstract class BaseCdt {
  /** 标识符，或恰好一个点的 表.字段 */
  private static readonly COL_REG = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/;

  clazz:string =  'BaseCdt';
  abstract toSql(colChanger:IColChanger):Sql;

  getSql(colChanger:IColChanger):Sql{
    return this.toSql(colChanger);
  }

  abstract isHit(row):boolean ;

  abstract toEs():any;


  isValid():boolean{
    return true;
  }

  getClazz(){
    return 'BaseCdt'
  }
  

  /**
   * 字段只允许标识符，或恰好一个点的表.字段。
   */
  protected assertColSafe(col: string | string[]) {
    if (col instanceof Array) {
      for (let i = 0; i < col.length; i++) {
        this.assertOneCol(col[i]);
      }
      return;
    }
    this.assertOneCol(col);
  }

  private assertOneCol(col: string) {
    if (typeof col != 'string' || !BaseCdt.COL_REG.test(col)) {
      throw new Error('Cdt字段不合法');
    }
  }

  protected changeCol(col:string,colChanger?:IColChanger):string{
    if(colChanger!=null){
      col = colChanger.parsePojoField(col)
    }
    return col;
  }
  /**
   * 将一个结构体转成条件
   * @param cdt 
   * @returns 
   */
  static parse(cdt):BaseCdt{
    if(cdt == null)
      return null;
    if(cdt.clazz == 'BaseCdt'){
      return cdt;
    }
    let andCdt = new AndCdt();
    for(var e in cdt){
      if(cdt[e]!=null){
        if(cdt[e].clazz  =='BaseCdt') {
          andCdt.addCdt(cdt[e])
        }else{
          andCdt.eq(e,cdt[e]);
        }
      }
    }
    return andCdt
  }
}
import AndCdt from './imp/AndCdt'
