"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * socket 的“房间”
 */
class default_1 {
    static getRoom(roomId) {
        let room = this.roomMap[roomId];
        if (room == null) {
            room = {};
            this.roomMap[roomId] = room;
        }
        return room;
    }
    static joinRoom(roomId, processor) {
        let room = this.getRoom(roomId);
        room[processor.getUuid()] = processor;
    }
    static levelRoom(roomId, processor) {
        let room = this.getRoom(roomId);
        delete room[processor.getUuid()];
    }
    static emitMsg(roomId, msg) {
        let room = this.getRoom(roomId);
        for (let e in room) {
            room[e].send(msg);
        }
    }
    static emit(roomId, eventType, msg) {
        let room = this.getRoom(roomId);
        for (let e in room) {
            room[e].send({
                msg,
                eventType
            });
        }
    }
}
default_1.roomMap = {};
exports.default = default_1;
