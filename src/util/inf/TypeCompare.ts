/**
 * 类型比较接口
 */
export default interface TypeCompare {
  diff?(obj1: any, obj2: any): boolean;
  getStr?(val1: any): string;
}