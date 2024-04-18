
import ColChanger from '../../colChanger/ColChanger';
import Sql from '../../sql/Sql'

export default abstract class BaseCdt {
  clazz:string =  'BaseCdt';
  abstract toSql(colChanger:ColChanger):Sql;

  getSql(colChanger:ColChanger):Sql{
    return this.toSql(colChanger);
  }

  abstract isHit(row):boolean ;

  abstract toEs():any;

  getClazz(){
    return 'BaseCdt'
  }
  

  protected changeCol(col:string,colChanger?:ColChanger):string{
    if(colChanger!=null){
      let index = col.lastIndexOf('.');
      if(index == -1){
        col = colChanger.parsePojoField(col)
      }else{
        let start = col.substring(0,index);
        let end = col.substring(index+1);
        end = colChanger.parsePojoField(end);
        col = `${start}.${end}`
      }
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
