"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UuidUtil_1 = __importDefault(require("./UuidUtil"));
const util = new UuidUtil_1.default();
const uuid = util.getUuid();
console.log('Generated UUID:', uuid);
if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
    console.log('UUID format is correct');
}
else {
    console.error('UUID format is incorrect');
    process.exit(1);
}
