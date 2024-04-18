import {Request,Response} from 'express'


export default class {
    /**
     * 读取cookie
     * @param req 
     * @returns 
     */
    static readCookie(req:Request):any {
        var ret = {}
        var rc = req.headers.cookie
        rc && rc.split(';').forEach(function(cookie) {
            var parts = cookie.split('=')
            ret[parts.shift().trim()] = decodeURI(parts.join('='))
        })
        return ret
    }
}