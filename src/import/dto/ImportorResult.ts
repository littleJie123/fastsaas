import ImportorObj from "./ImportorObj";

interface ImportorResult {
  checked: boolean;
  datas?: ImportorObj[];
  msg?: string;
  errorCode?: string
}
export default ImportorResult;