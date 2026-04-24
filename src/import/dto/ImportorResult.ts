import ImportorObj from "./ImportorObj";
interface ImportorError {
  errorCode: string;
  msg: string;
  btns?: { title: string, value: string }[]

}

interface ImportorResult {
  checked: boolean;
  datas?: ImportorObj[];
  msg?: string;
  errorCode?: string
  errors?: ImportorError[]
  errorNo?: string;
  excelFileId?: number;
}
export default ImportorResult;