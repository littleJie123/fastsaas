export default abstract class ValueType {
    abstract isHit(val: any): boolean;
    abstract isEq(val1: any, val2: any): boolean;
}
