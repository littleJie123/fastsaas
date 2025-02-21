"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const buildParam_1 = __importDefault(require("./wiget/buildParam"));
const Socket_1 = __importDefault(require("../webSocket/Socket"));
const loadRouter_1 = __importDefault(require("./wiget/loadRouter"));
const debugHealth_1 = __importDefault(require("./wiget/debugHealth"));
function init(opt) {
    if (opt == null)
        opt = {};
    if (opt.port == null) {
        opt.port = 8080;
    }
    return opt;
}
function createFun(clazz) {
    return function (req, resp) {
        var ctrl = new clazz();
        ctrl.execute(req, resp);
    };
}
function customBodyParser(req, res, next) {
    let body = [];
    let length = 0;
    req.on('data', (chunk) => {
        body.push(chunk);
        length += chunk.length;
    });
    req.on('end', () => {
        if (req.method == 'POST') {
            req._bodyBytes = body;
            try {
                let buffer = Buffer.alloc(length);
                for (let i = 0, pos = 0, size = body.length; i < size; i++) {
                    body[i].copy(buffer, pos);
                    pos += body[i].length;
                }
                let param = {};
                let contentType = req.headers['content-type'];
                if (contentType.includes('application/x-www-form-urlencoded')) {
                    let tmpParams = buffer.toString('utf-8');
                    tmpParams.split('&').forEach(param => {
                        const [key, value] = param.split('=');
                        param[key] = decodeURIComponent(value);
                    });
                }
                else if (contentType.includes('application/json')) {
                    param = JSON.parse(buffer.toString('utf-8'));
                }
                else if (contentType.includes('application/xml')) {
                    // param = await this.xmlToJson(buffers.toString());
                }
                req.body = param;
            }
            catch (e) {
                console.debug(e.message);
            }
        }
        next();
    });
}
function initApp(app, opt) {
    //HealthCheck.registerEndpoints(app) // 健康检查
    app.use('/debug/health', (0, debugHealth_1.default)());
    app.use((0, cors_1.default)({ maxAge: 6000, origin: true, credentials: true }));
    if (opt.keepBody == null || opt.keepBody == false) {
        app.use(body_parser_1.default.json({ limit: '50mb' }));
        app.use(body_parser_1.default.urlencoded({
            limit: '50mb',
            extended: true
        }));
    }
    else {
        app.use(customBodyParser);
    }
    app.use((0, buildParam_1.default)(opt));
    if (opt.mids) {
        var mids = opt.mids;
        for (var mid of mids) {
            app.use(mid);
        }
    }
    if (opt.midsMap) {
        let midsMap = opt.midsMap;
        for (let e in midsMap) {
            app.use(e, midsMap[e]);
        }
    }
}
function addRouters(app, opt) {
    var routers = opt.routers;
    if (routers == null)
        return;
    for (var router of routers) {
        var { key, fun, ctrl } = router;
        if (fun == null) {
            fun = createFun(ctrl);
        }
        app.use('/' + key, fun);
    }
}
function default_1(opt) {
    opt = init(opt);
    let app = (0, express_1.default)();
    app.disable('x-powered-by');
    let apiPort = opt.port;
    initApp(app, opt);
    (0, loadRouter_1.default)(app, opt);
    addRouters(app, opt);
    let server = app.listen(apiPort, function () {
        console.log(`app listening at ${apiPort}`);
    });
    if (opt.webSocketClazz) {
        Socket_1.default.listen(server, opt.webSocketClazz);
    }
    app.disable('x-powered-by');
    return app;
}
