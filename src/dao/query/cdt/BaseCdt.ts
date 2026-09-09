
import IColChanger from '../../colChanger/IColChanger';
import Sql from '../../sql/Sql'

export default abstract class BaseCdt {
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
