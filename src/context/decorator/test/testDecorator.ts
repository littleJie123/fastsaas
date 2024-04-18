function addAge(constructor: Function) {
    constructor.prototype.age = 18;
  }
  ​
    function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target,target[propertyKey]);
        
        target[propertyKey]()
        target[propertyKey] = function(){
            console.log('1111222');
            
        }
        console.log("prop " + propertyKey);
        console.log("desc " + JSON.stringify(descriptor) + "\n\n");
         
    };
  ​
  @addAge          
  class Hello{
    name: string="AA";
    age: number;
    constructor() {
      //console.log('hello');
      this.name = 'yugo';
    }
  ​
    @method
    hello(){
        console.log('aaaaa');
        return 'instance method';
    }
  ​
    @method
    static shello(){
      return 'static method';
    }
  }
  let hello = new Hello();
  hello.hello();

  console.log('111111')
  Hello.shello()