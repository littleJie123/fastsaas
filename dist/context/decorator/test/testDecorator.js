var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function addAge(constructor) {
    constructor.prototype.age = 18;
}
function method(target, propertyKey, descriptor) {
    console.log(target, target[propertyKey]);
    target[propertyKey]();
    target[propertyKey] = function () {
        console.log('1111222');
    };
    console.log("prop " + propertyKey);
    console.log("desc " + JSON.stringify(descriptor) + "\n\n");
}
;
let Hello = class Hello {
    constructor() {
        this.name = "AA";
        //console.log('hello');
        this.name = 'yugo';
    }
    hello() {
        console.log('aaaaa');
        return 'instance method';
    }
    static shello() {
        return 'static method';
    }
};
__decorate([
    method
], Hello.prototype, "hello", null);
__decorate([
    method
], Hello, "shello", null);
Hello = __decorate([
    addAge
], Hello);
let hello = new Hello();
hello.hello();
console.log('111111');
Hello.shello();
