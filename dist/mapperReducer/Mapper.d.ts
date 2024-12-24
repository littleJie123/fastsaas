import { IGeter } from "../fastsaas";
export default class Mapper<Pojo = any> {
    private mapper;
    constructor(datas: Pojo[], keys: IGeter[]);
    private init;
    get(keys: string[]): Pojo[];
    private getArrayFromMap;
    private doGetArrayFromMap;
}
