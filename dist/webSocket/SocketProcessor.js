"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const SocketRoom_1 = __importDefault(require("./SocketRoom"));
const ws_1 = __importDefault(require("ws"));
const S_Join = 'join';
const S_Level = 'level';
class default_1 {
    constructor() {
        this.roomIds = {};
    }
    send(msg) {
        let ws = this.ws;
        if (ws.readyState === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }
    getUuid() {
        return this.uuid;
    }
    onConnect(ws) {
        this.ws = ws;
        ws.on('message', (message) => {
            try {
                let json = JSON.parse(message);
                if (json.eventType == S_Join) {
                    this.joinRoom(json.msg);
                }
                else if (json.eventType == S_Level) {
                    this.levelRoom(json.msg.roomId);
                }
                else {
                    this.onMessage(json);
                }
            }
            catch (e) {
            }
        });
        // 监听关闭事件
        ws.on('close', () => {
            console.log('------------------ on close------------------------');
            this.onClose();
        });
    }
    onMessage(json) {
    }
    joinRoom(msg) {
        let roomId = msg.roomId;
        if (this.uuid == null) {
            if (msg.uuid != null) {
                this.uuid = msg.uuid;
            }
            else {
                this.uuid = (0, uuid_1.v4)();
            }
        }
        this.roomIds[roomId] = true;
        SocketRoom_1.default.joinRoom(roomId, this);
    }
    levelRoom(roomIds) {
        delete this.roomIds[roomIds];
        SocketRoom_1.default.levelRoom(roomIds, this);
    }
    onClose() {
        for (let e in this.roomIds) {
            this.levelRoom(e);
        }
    }
    getRoomIdArray() {
        let ret = [];
        for (let e in this.roomIds) {
            ret.push(e);
        }
        return ret;
    }
}
exports.default = default_1;
