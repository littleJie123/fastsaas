export default interface UpdateOpt<Do = any> {
    whereObj: any;
    cols?: string[];
    datas: Do[];
    other?: any;
}
