export default function (opt: any): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => T;
