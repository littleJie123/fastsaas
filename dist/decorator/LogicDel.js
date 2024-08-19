"use strict";
/**
 * 逻辑删除装饰器
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DefOnChangeOpt_1 = __importDefault(require("./../util/inf/imp/DefOnChangeOpt"));
function default_1(opt) {
    if (opt == null) {
        opt = {};
    }
    const delCol = opt.col || 'is_del';
    const mode = opt.mode || 1;
    const changeOpt = new DefOnChangeOpt_1.default({
        async onAdd(dao, data) {
            data[delCol] = 0;
        },
        async onDel(dao, data) {
            data[delCol] = 1;
        }
    });
    return function classDecorator(constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this._delMode = mode; //默认是1
            }
            setDelMode(mode) {
                this._delMode = mode;
            }
            async add(obj) {
                await changeOpt.onAdd(this, obj);
                var ret = await super['add'](obj);
                return ret;
            }
            async del(obj, opts) {
                let ret;
                if (this._delMode === 2) {
                    await changeOpt.onDel(this, obj);
                    ret = await super['update'](obj, opts);
                }
                else {
                    ret = await super['del'](obj, opts);
                }
                return ret;
            }
            async delArray(array, opts) {
                let ret;
                if (this._delMode === 2) {
                    await changeOpt.onDelArray(this, array);
                    ret = await super['updateArray'](array, opts);
                }
                else {
                    ret = await super['delArray'](array, opts);
                }
                return ret;
            }
            async addArray(array) {
                await changeOpt.onAddArray(this, array);
                var ret = await super['addArray'](array);
                return ret;
            }
        };
    };
}
exports.default = default_1;
