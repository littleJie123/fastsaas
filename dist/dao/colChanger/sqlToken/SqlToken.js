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
     * 返回原始 sql 片段
     */
    toSql() {
        return this.chars.join('');
    }
    /**
     * 是否需要更改字段
     */
    needChange() {
        return this.getField() != null;
    }
    /**
     * 返回需要更改的字段，不需要更改则返回 null
     */
    getField() {
        return null;
    }
    /**
     * 将新的 db 字段组成合适的 sql
     * @param dbField
     */
    changeByDbField(dbField) {
        return this.toSql();
    }
}
exports.default = default_1;
