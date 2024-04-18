export default  function(opt:any){
   
  return function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    if(opt != null){
      for(let e in opt){
        constructor.prototype[e] = opt[e]
      }
    }
    return constructor;
  }
}