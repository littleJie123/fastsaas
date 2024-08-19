declare function addAge(constructor: Function): void;
declare function method(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
declare class Hello {
    name: string;
    age: number;
    constructor();
    hello(): string;
    static shello(): string;
}
declare let hello: Hello;
