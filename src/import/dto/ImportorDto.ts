/**
 * 每个列的dto类
 */

interface ImportDto{
  id?:number;
  name:any;
  error?:string;
  dbId?:number;
  param?:any;
}
export default ImportDto;