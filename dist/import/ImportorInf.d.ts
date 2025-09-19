import { ImportorObj } from "../fastsaas";
interface ImportorInf {
    /**
     * 导入前的检查,返回false 会导致导入不再进行
     * @param param
     * @param datas
     * @param rows
     */
    onImportChecker?(param: any, datas: ImportorObj[], rows: any[]): Promise<boolean>;
    /**
     * 导入的类，返回的数据会被和datas种的importorobj进行聚合
     * @param param
     * @param datas
     * @param rows
     */
    onImport(param: any, datas: ImportorObj[], rows: any[]): Promise<any>;
}
export default ImportorInf;
