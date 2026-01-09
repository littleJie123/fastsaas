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
const S_Action = 'S_Action';
const S_Error = 'S_Error';
const S_ActionResult = 'S_ActionResult';
class default_1 {
    constructor() {
        this.actionMap = null;
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
    onConnect(ws, map, opt) {
        this.ws = ws;
        this.actionMap = map;
        this.opt = opt;
        ws.on('message', (message) => {
            try {
                let json = JSON.parse(message);
                if (json.eventType == S_Join) {
                    this.joinRoom(json.msg);
                }
                else if (json.eventType == S_Level) {
                    this.levelRoom(json.msg.roomId);
                }
                else if (json.eventType == S_Action) {
                    this.processAction(json.msg);
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
    async processAction(json) {
        if (this.actionMap != null) {
            let url = json.url;
            if (url == null) {
                this.send({
                    eventType: S_Error,
                    msg: {
                        message: '没有url'
                    }
                });
                return;
            }
            if (!url.startsWith('/')) {
                url = '/' + url;
            }
            let ActionClazz = this.actionMap[url.toLowerCase()];
            if (ActionClazz == null) {
                this.send({
                    eventType: S_Error,
                    msg: {
                        message: 'url没有对应的action'
                    }
                });
                return;
            }
            else {
                let param = json.param;
                let opt = this.opt;
                if (ActionClazz.default) {
                    ActionClazz = ActionClazz.default;
                }
                var ctrl = new ActionClazz();
                if (opt.context) {
                    var context = opt.context;
                    var childContext = context.buildChild();
                    if (ctrl.setContext) {
                        ctrl.setContext(childContext);
                    }
                    childContext.assembly([ctrl]);
                    if (opt.interceptorBeans) {
                        for (let beanStr of opt.interceptorBeans) {
                            try {
                                let bean = childContext.get(beanStr);
                                if (bean != null && bean.onBefore) {
                                    let ret = await bean.onBefore(null, null, param);
                                    if (ret) {
                                        return;
                                    }
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                }
                if (ctrl.setSocketProcessor) {
                    ctrl.setSocketProcessor(this);
                }
                let result = await ctrl.executeWebSocket(param);
                this.send({
                    eventType: S_ActionResult,
                    msg: {
                        id: json.id,
                        result
                    }
                });
            }
        }
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
    levelRoom(roomId) {
        delete this.roomIds[roomId];
        SocketRoom_1.default.levelRoom(roomId, this);
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
