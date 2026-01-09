"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class default_1 {
    static listen(server, clazz, map, opt) {
        let wss = new ws_1.default.Server({ server });
        wss.on('connection', (ws) => {
            let processor = new clazz;
            processor.onConnect(ws, map, opt);
        });
    }
}
exports.default = default_1;
