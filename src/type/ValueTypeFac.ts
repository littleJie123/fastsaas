import { DateUtil } from "../fastsaas";
import DateValueType from "./DateValueType";
import NumValueType from "./NumValueType";
import StrValueType from "./StrValueType";
import ValueType from "./ValueType";

export default class ValueTypeFac {
  static isEq(obj1: any, obj2: any): boolean {
    let types = this.getTypes();
    for (let i = 0; i < types.length; i++) {
      let v = types[i];
      if (v.isHit(obj1)) {
        return v.isEq(obj1, obj2);
      }
    }
    return obj1 == obj2;
  }


  private static getTypes(): ValueType[] {
    return [
      new NumValueType(),
      new StrValueType(),
      new DateValueType()
    ]
  }
}