export default interface MergeOpt {
    init?(obj1: any): any;
    isHit(obj1: any, obj2: any): boolean;
    addObj(obj1: any, obj2: any): any;
}
