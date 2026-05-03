import ValueType from "./ValueType";

export default class extends ValueType {
  isHit(val: any): boolean {
    return val instanceof Date;
  }
  isEq(val1: any, val2: any): boolean {
    return val1.getTime() == val2.getTime();
  }

}