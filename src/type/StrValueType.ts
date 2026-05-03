import { StrUtil } from "../fastsaas";
import ValueType from "./ValueType";

export default class extends ValueType {
  isHit(val: any): boolean {
    return StrUtil.isStr(val);
  }
  isEq(val1: any, val2: any): boolean {
    return val1 === val2;
  }
}