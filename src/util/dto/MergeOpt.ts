export default interface MergeOpt{

  init?(obj1):any;
  isHit(obj1,obj2):boolean;
  addObj(obj1,obj2):any;
}