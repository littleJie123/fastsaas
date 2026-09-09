export default interface IColChanger {
  isValid(col: string): boolean;
  getPojoCols(): string[];
  parseDbField(col: string): string;
  parsePojoField(pojoField: string): string;
  parsePojoFieldsToDbFields(pojoFields: string[]): string[];
  changeSql(sql: string): string;
  changeDb2Pojo(data: any): any;
  changeDbArray2Pojo(array: any[]): any[];
}
