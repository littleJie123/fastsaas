/**
 * 表示一个sql
 */
import ISql from './ISql'
import { sqlType } from '../.././constant'
import ColChanger from '../colChanger/ColChanger';

export default class Sql implements ISql{
  private _sql:string = '';
  private _val:Array<object> = [];
  private _other:Array<Sql> = []; 
  clazz:string = 'Sql';
  constructor(sql?:string,val?:any){
    if(sql !=null && sql != undefined)
      this._sql = sql;
    if(val != null && val != undefined){
      if(val instanceof Array){
        this._val.push(... val);
      }else{
        this._val.push(val)
      }
    }
  }

   
  getSql(){
    return this;
  }
  toSql():string{
    let other = this._other.map((sql)=> sql.toSql());
    let strs:string[] = [this._sql , other.join(' ')];
    return strs.join(' ');
  }

  toVal():Array<object>{
    let ret = [];
    ret.push(... this._val)
    this._other.map(sql=> { 
      let val = sql.toVal()
      if (val) ret.push(...val)
    });
    return ret;
  }

  add(sql:Sql|String|string):Sql{
    if(sql == null){
      return this;
    }
    if(sql['clazz'] == 'Sql'){
      this._other.push(<Sql>sql)
    }else{
      this._other.push(new Sql(<string>sql));
    }
    return this;
  }

  /**
   * @description cols 格式化
   * @param cols
   */
  protected _colsToArray (cols: string | string[]): string[] {
    cols = (// 直接 return 无变化, 应该是引用传递的问题, 但是 why
      cols instanceof Array ? cols : cols.split(',')
    ).map(val => val.trim()).filter(val => val)
    return cols
  }
}