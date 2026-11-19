"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./ArrayUtil");
class SaveUtil {
    /**
     * 在内存中执行增删改查合并数据。
     * 以 datas 为老数据，按 pkCol 把 updates 盖到对应行上，去掉 dels，再接上 adds。
     * 返回新数组。老数据会浅拷贝后再改，避免改到入参。adds 原样接上。主键对不上的修改、删除跳过。
     */
    static save(datas, param, opt) {
        let rows = this.copyRows(datas);
        if (param == null) {
            return rows;
        }
        this.applyUpdates(rows, param.updates, opt.pkCol);
        let retained = this.applyDels(rows, param.dels, opt.pkCol);
        if (param.adds == null || param.adds.length == 0) {
            return retained;
        }
        return retained.concat(param.adds);
    }
    /**
     * 浅拷贝每一行。空列表返回空数组。
     */
    static copyRows(list) {
        if (list == null || list.length == 0) {
            return [];
        }
        let ret = [];
        for (let row of list) {
            if (row == null) {
                continue;
            }
            ret.push(Object.assign({}, row));
        }
        return ret;
    }
    /**
     * 按主键把修改盖到已有行上。同一主键多条修改时，后面的覆盖前面的。
     */
    static applyUpdates(rows, updates, pkCol) {
        if (updates == null || updates.length == 0) {
            return;
        }
        let map = ArrayUtil_1.ArrayUtil.toMapByKey(rows, pkCol);
        for (let update of updates) {
            if (update == null) {
                continue;
            }
            let pk = this.pkOf(update, pkCol);
            if (pk == null) {
                continue;
            }
            let old = map[pk];
            if (old == null) {
                continue;
            }
            Object.assign(old, update);
        }
    }
    /**
     * 按主键去掉要删除的行。主键为空的老数据保留。
     */
    static applyDels(rows, dels, pkCol) {
        if (dels == null || dels.length == 0) {
            return rows;
        }
        let delMap = ArrayUtil_1.ArrayUtil.toMapByKey(dels, pkCol);
        let ret = [];
        for (let row of rows) {
            let pk = this.pkOf(row, pkCol);
            if (pk == null || delMap[pk] == null) {
                ret.push(row);
            }
        }
        return ret;
    }
    static pkOf(row, pkCol) {
        if (row == null) {
            return null;
        }
        return row[pkCol];
    }
}
exports.default = SaveUtil;
