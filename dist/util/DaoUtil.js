"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DefOnChangeOpt_1 = __importDefault(require("./inf/imp/DefOnChangeOpt"));
class DaoUtil {
    /**
     *
     * 当数据往数据库里面插以后，执行该参数
     *  fun的参数 dao,array[变化的数据的数组形式],type 类型
     * @param fun
     */
    static createAfterRun(fun) {
        return DaoUtil.createOnChangeDecorator(new DefOnChangeOpt_1.default({
            async afterAdd(dao, obj) {
                await fun(dao, [obj], 'add');
            },
            async afterAddArray(dao, array) {
                await fun(dao, array, 'add');
            },
            async afterUpdate(dao, cnt, obj, opt) {
                await fun(dao, [obj], 'update');
            },
            async afterUpdateArray(dao, cnt, array, other) {
                await fun(dao, array, 'update');
            },
            async afterDel(dao, cnt, obj, opt) {
                await fun(dao, [obj], 'del');
            },
            async afterDelArray(dao, cnt, array, opt) {
                await fun(dao, array, 'del');
            }
        }));
    }
    /**
     * 给增加修改的时候设置某个值
     * @param opt
     */
    static createAddAndUpdate(opt) {
        if (opt == null) {
            opt = { addCol: 'sysAddTime', updateCol: 'sysModifyTime' };
        }
        let cols = [];
        let { addCol, updateCol } = opt;
        if (addCol != null)
            cols.push(addCol);
        if (updateCol != null) {
            cols.push(updateCol);
        }
        let changeOpt = {
            async onAdd(dao, data) {
                for (let col of cols) {
                    let val = opt.processFun(dao, data);
                    if (val != null)
                        data[col] = val;
                }
            },
            async onUpdate(dao, data, opts) {
                if (updateCol) {
                    let val = opt.processFun(dao, data);
                    if (val != null)
                        data[updateCol] = val;
                }
            },
            async onUpdateArray(dao, array, other, whereObj) {
                if (updateCol) {
                    if (other == null)
                        other = {};
                    let val = opt.processFun(dao, other);
                    if (val != null)
                        other[updateCol] = val;
                }
            }
        };
        return DaoUtil.createOnChangeDecorator(new DefOnChangeOpt_1.default(changeOpt));
    }
    /**
     * 给增加修改的时候设置某个值
     * @param opt
     */
    static createAddAndUpdateByProcessFun(fun) {
        let changeOpt = {
            async onAdd(dao, data) {
                await fun(dao, data);
            },
            async onUpdate(dao, data, opts) {
                await fun(dao, data);
            },
            async onUpdateArray(dao, array, other, whereObj) {
                if (other == null)
                    other = {};
                fun(dao, other);
            }
        };
        return DaoUtil.createOnChangeDecorator(new DefOnChangeOpt_1.default(changeOpt));
    }
    /**
     * 创建一个基于数据变化的
     */
    static createOnChangeDecorator(changeOpt) {
        return function classDecorator(constructor) {
            return class extends constructor {
                async update(obj, opts) {
                    await changeOpt.onUpdate(this, obj, opts);
                    var ret = await super['update'](obj, opts);
                    await changeOpt.afterUpdate(this, ret, obj, opts);
                    return ret;
                }
                async add(obj) {
                    await changeOpt.onAdd(this, obj);
                    var ret = await super['add'](obj);
                    await changeOpt.afterAdd(this, ret);
                    return ret;
                }
                async del(obj, opts) {
                    await changeOpt.onDel(this, obj, opts);
                    var ret = await super['del'](obj, opts);
                    await changeOpt.afterDel(this, ret, obj, opts);
                    return ret;
                }
                async delArray(array, opts) {
                    await changeOpt.onDelArray(this, array, opts);
                    var ret = await super['delArray'](array, opts);
                    await changeOpt.afterDelArray(this, ret, array, opts);
                    return ret;
                }
                async addArray(array) {
                    await changeOpt.onAddArray(this, array);
                    var ret = await super['addArray'](array);
                    await changeOpt.afterAddArray(this, ret);
                    return ret;
                }
                async updateArray(array, opts, whereObj) {
                    if (opts == null)
                        opts = {};
                    await changeOpt.onUpdateArray(this, array, opts, whereObj);
                    var ret = await super['updateArray'](array, opts, whereObj);
                    await changeOpt.afterUpdateArray(this, ret, array, opts, whereObj);
                    return ret;
                }
            };
        };
    }
}
exports.default = DaoUtil;
