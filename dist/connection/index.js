"use strict";
/*
 * @Author       : kaikai.hou
 * @Email        : kaikai.hou@downtown8.com
 * @Description  : Balabala
 * @Date         : 2020-01-20 13:51:09
 * @LastEditors  : kaikai.hou
 * @LastEditTime : 2020-01-20 15:16:30
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
class Connection {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('connect');
                resolve();
            }, 1000);
        });
        return this;
    }
}
exports.Connection = Connection;
