"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    /**
     * 读取cookie
     * @param req
     * @returns
     */
    static readCookie(req) {
        var ret = {};
        var rc = req.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            ret[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return ret;
    }
}
exports.default = default_1;
