"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapEvent_1 = __importDefault(require("./../../../bus/event/MapEvent"));
class AskFile extends MapEvent_1.default {
    constructor() {
        super('askFile');
    }
}
exports.default = AskFile;
