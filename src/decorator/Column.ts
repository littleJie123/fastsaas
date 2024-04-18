/**
 * 构造db字段和内存属性的映射关系
 * @param typeOrOptions 
 * @returns 
 */
export default function Column(
  typeOrOptions: { name: string }
): PropertyDecorator {
  return function (object: any, propertyName: string) {
    if (!object.__dbToPojoMap) {
        object.__dbToPojoMap = {}
    }
    object.__dbToPojoMap[typeOrOptions.name] = propertyName;
  }
}