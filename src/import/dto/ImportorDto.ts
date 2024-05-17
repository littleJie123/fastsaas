/**
 * 每个列的dto类
 */

interface ImportDto{
  id?:number;
  name:string;
  error?:string;
  dbId?:number;
}
export default ImportDto;