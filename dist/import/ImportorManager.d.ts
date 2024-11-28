import { Context } from "../fastsaas";
import Importor from "./Importor";
import ImportorObj from "./dto/ImportorObj";
import ImportorResult from "./dto/ImportorResult";
/**
 * 导入指挥官
 */
interface ImportorManagerOpt {
    importors: Importor[];
}
export default class ImportorManager {
    private opt;
    constructor(opt: ImportorManagerOpt);
    process(context: Context, param: any, dataArray: any[]): Promise<ImportorResult>;
    /**
     * 转变数据
     * @param data
     * @param caolMap
     */
    protected change(datas: any[]): ImportorObj[];
}
export {};
