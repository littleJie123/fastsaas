export default interface IDaoHelper{
  find(key:string,query:any):Promise<any[]>;
}