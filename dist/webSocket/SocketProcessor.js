"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketRoom_1 = __importDefault(require("./SocketRoom"));
const ws_1 = __importDefault(require("ws"));
const UuidUtil_1 = __importDefault(require("../util/UuidUtil"));
const S_Join = 'join';
const S_Level = 'level';
const S_Action = 'S_Action';
const S_Error = 'S_Error';
const S_ActionResult = 'S_ActionResult';
/**
 * 一个websocket一个链接
 */
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
    sendEvent(eventType, msg) {
        this.send({
            eventType,
            msg
        });
    }
    getUuid() {
        if (this.uuid == null) {
            this.uuid = UuidUtil_1.default.getUuid();
        }
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
                    this.joinRoom(json.msg.roomId);
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
                                if (bean != null && bean.onWebSocketBefore) {
                                    if (bean.setSocketProcessor) {
                                        bean.setSocketProcessor(this);
                                    }
                                    let ret = await bean.onWebSocketBefore(url, param);
                                    if (ret) {
                                        return;
                                    }
                                }
                            }
                            catch (e) {
                                this.sendError(e);
                                console.error(e);
                                return;
                            }
                        }
                    }
                }
                if (ctrl.setSocketProcessor) {
                    ctrl.setSocketProcessor(this);
                }
                let result = await ctrl.executeWebSocket(param, url);
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
    sendError(e) {
        this.send({
            eventType: S_Error,
            msg: {
                message: e.message
            }
        });
    }
    onMessage(json) {
    }
    joinRoom(roomId) {
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
