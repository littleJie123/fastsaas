interface MapNameOpt {
    col: string;
    map: any;
    fun?(data: any, value: any): void;
}
export default class MapNameHat {
    private opt;
    constructor(opt: MapNameOpt);
    process(list: any[]): void;
}
export {};
