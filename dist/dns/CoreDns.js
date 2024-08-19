"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
/**
 * 从参数得到回调函数
 * @param args
 */
function getCallbackFun(args) {
    if (args.length == 3)
        return args[2];
    return args[1];
}
/**
 * 将参数构造成key
 * @param retArray
 * @param opts
 * @param key
 * @param defVal
 */
function add(retArray, opts, key, defVal) {
    if (defVal == null)
        defVal = '';
    let val;
    if (opts == null) {
        val = defVal;
    }
    else {
        val = opts[key];
        if (val == null) {
            val = defVal;
        }
    }
    retArray.push(`${key}_${val}`);
}
function calKeys(args) {
    if (args.length == 2 || args[1] == null) {
        return args[0];
    }
    let retArray = [];
    retArray.push(args[0]);
    let opts = args[1];
    if (typeof (opts) == 'number' || opts instanceof Number) {
        opts = { family: opts };
    }
    add(retArray, opts, 'family', 0);
    add(retArray, opts, 'hints');
    add(retArray, opts, 'all', false);
    add(retArray, opts, 'verbatim', false);
    return retArray.join('___');
}
function getFromCache(args, defVal) {
    let fun = getCallbackFun(args);
    let result = defVal.result;
    runFun(fun, result.err, result.address, result.family);
}
function runFun(fun, err, address, family) {
    if (CoreDns.needTimeout) {
        setTimeout(() => {
            fun(err, address, family);
        }, 15000);
    }
    else {
        fun(err, address, family);
    }
}
function proxyFun(lookup, args) {
    let proxyArgs = changeProxyArgs(args);
    lookup.apply(dns_1.default, proxyArgs);
}
function changeProxyArgs(args) {
    let array = [];
    for (let i = 0; i < args.length - 1; i++)
        array.push(args[i]);
    let key = calKeys(args);
    let fun = args[args.length - 1];
    let opt = null;
    if (args.length == 3)
        opt = args[1];
    array.push(function (err, address, family) {
        let ret = {
            param: {
                hostname: args[0],
                opt
            },
            result: {
                err,
                address,
                family
            }
        };
        map[key] = ret;
        runFun(fun, err, address, family);
    });
    return array;
}
let map = {};
class CoreDns {
    static init() {
        let lookup = dns_1.default.lookup;
        this.lookup = lookup;
        let mydns = dns_1.default;
        mydns['lookup'] = function () {
            if (arguments.length < 2 || arguments.length > 3) {
                lookup.apply(dns_1.default, arguments);
            }
            let key = calKeys(arguments);
            let mapVal = map[key];
            if (mapVal == null) {
                proxyFun(lookup, arguments);
            }
            else {
                try {
                    getFromCache(arguments, mapVal);
                }
                catch (e) {
                    proxyFun(lookup, arguments);
                }
            }
        };
        this.beginTimeout();
    }
    static beginTimeout() {
        if (this.timeout == null) {
            this.timeout = this._checkOnTimeOut();
        }
    }
    static _checkOnTimeOut() {
        setTimeout(() => {
            try {
                this.refreshCache();
            }
            catch (e) {
                console.error(e);
            }
            this._checkOnTimeOut();
        }, 60 * 1000);
    }
    static refreshCache() {
        for (let e in map) {
            let val = map[e];
            let param = val.param;
            this.lookup.apply(dns_1.default, [param.hostname, param.opt, function (err, address, family) {
                    let ret = {
                        param,
                        result: {
                            err,
                            address,
                            family
                        }
                    };
                    map[e] = ret;
                }]);
        }
    }
}
CoreDns.needTimeout = false;
exports.default = CoreDns;
