import DaoOpt from '../opt/DaoOpt'
import { Sql } from '../sql';

export default abstract class Builder {


  protected _opt: DaoOpt;

  abstract build(obj: any, opts?: any): Sql;

  constructor(opt: any) {
    if (opt == null)
      opt = {};
    if (!(opt instanceof DaoOpt))
      opt = new DaoOpt(opt);

    this._opt = opt;
  }


}