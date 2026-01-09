"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const StrUtil_1 = require("../../util/StrUtil");
/**
 截取mocker
*/
function createFun(clazz, opt) {
    if (clazz.default) {
        //兼容ts的export
        clazz = clazz.default;
    }
    return async function (req, resp) {
        var _a;
        var ctrl = new clazz();
        if (opt.context) {
            var context = opt.context;
            var childContext = context.buildChild();
            if (ctrl.setContext) {
                ctrl.setContext(childContext);
            }
            // fix 如果req.headers.context_id不是数字,则忽略掉
            if (req.headers.context_id != null && !isNaN(req.headers.context_id)) {
                childContext.setId(req.headers.context_id);
            }
            childContext.setSessionId((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.session_id);
            childContext.assembly([ctrl]);
            if (opt.interceptorBeans) {
                for (let beanStr of opt.interceptorBeans) {
                    try {
                        let bean = childContext.get(beanStr);
                        if (bean != null && bean.onBefore) {
                            let ret = await bean.onBefore(req, resp, req._param);
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
        ctrl.execute(req, resp);
    };
}
function loadFromWebPath(app, opt) {
    let map = {};
    if (opt.webPath == null) {
        return;
    }
    /**
     * 构建路由
     * @param dirPath
     * @param webPath
     */
    function buildRouter(dirPath, webPath) {
        let extName = path_1.default.extname(dirPath);
        if (extName == '.js' || (extName == '.ts' && dirPath.indexOf('.d.') == -1)) {
            var clazz = require(dirPath);
            if (clazz.default) {
                clazz = clazz.default;
            }
            var routerName = clazz.router;
            if (routerName) {
                if (routerName.length > 0 && routerName[0] !== '/') {
                    routerName = '/' + routerName;
                }
            }
            else {
                let routerPath = path_1.default.relative(webPath, dirPath);
                routerPath = routerPath.substring(0, routerPath.length - 3);
                routerPath = StrUtil_1.StrUtil.replace(routerPath, '\\', '/');
                routerName = '/' + routerPath;
            }
            app.all(routerName, createFun(clazz, opt));
            if (opt.needWebSocketAction) {
                map[routerName.toLowerCase()] = clazz;
            }
        }
    }
    /**
     *
     * @param dir 目录名
     * @param upDir 上层路径
     * @param webPath web的根目录
     * @returns
     */
    function _parseDir(dir, upDir, webPath) {
        /**得到全路径 */
        var dirPath = path_1.default.join(upDir, dir);
        var stat = fs_1.default.statSync(dirPath);
        if (stat.isFile()) {
            buildRouter(dirPath, webPath);
        }
        else {
            var files = fs_1.default.readdirSync(dirPath);
            for (var file of files) {
                _parseDir(file, dirPath, webPath);
            }
        }
    }
    var dirs = fs_1.default.readdirSync(opt.webPath);
    for (var dir of dirs) {
        _parseDir(dir, opt.webPath, opt.webPath);
    }
    return map;
}
//自动生成
function loadRouter(app, opt) {
    return loadFromWebPath(app, opt);
}
exports.default = loadRouter;
