import Query from "../query/Query";

export default interface IFind<Pojo = any>{
  findCnt(query: Query):Promise<number>;
  find(query: Query):Promise<Pojo[]>;
  getPojoIdCol?():string
  findData?(query): Promise<any[]>
}