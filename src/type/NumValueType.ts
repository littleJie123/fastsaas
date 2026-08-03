import NumUtil from "../util/NumUtil";
import ValueType from "./ValueType";

export default class extends ValueType {
  isHit(val: any): boolean {
    return NumUtil.isNum(val);
  }
  isEq(val1: any, val2: any): boolean {
    return NumUtil.isEq(val1, val2);
  }

}