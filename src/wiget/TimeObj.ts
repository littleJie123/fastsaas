export default interface TimeObj<T>{
    before?:TimeObj<T>;
   
    obj:T;
    timestamp:number;
    timeId:number;
}