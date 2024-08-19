"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./../../decorator/Server"));
const Bean_1 = __importDefault(require("./../../decorator/Bean"));
let Test1 = class Test1 {
    test1() {
        return this.test2.test2() + 100;
    }
    test() {
        return 1;
    }
};
__decorate([
    (0, Bean_1.default)()
], Test1.prototype, "test2", void 0);
Test1 = __decorate([
    (0, Server_1.default)()
], Test1);
exports.default = Test1;
