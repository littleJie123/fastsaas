"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.chars = [];
    }
    /**
     * 增加字符
     * @param c
     */
    add(c) {
        this.chars.push(c);
    }
    getLastChar() {
        return this.chars[this.chars.length - 1];
    }
    /**
     * 根据格式进行转化
     * @param pojoToDbMap
     */
    change(pojoToDbMap) {
        return this.chars.join('');
    }
}
exports.default = default_1;
