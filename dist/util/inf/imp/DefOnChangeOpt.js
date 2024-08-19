"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefOnChangeOpt {
    constructor(opt) {
        this._opt = opt;
    }
    async onAdd(dao, obj) {
        if (this._opt.onAdd) {
            await this._opt.onAdd(dao, obj);
        }
    }
    async afterAdd(dao, obj) {
        if (this._opt.afterAdd) {
            await this._opt.afterAdd(dao, obj);
        }
    }
    async onUpdate(dao, obj, opts) {
        if (this._opt.onUpdate) {
            await this._opt.onUpdate(dao, obj, opts);
        }
    }
    async afterUpdate(dao, cnt, obj, opts) {
        if (this._opt.afterUpdate) {
            await this._opt.afterUpdate(dao, cnt, obj, opts);
        }
    }
    async onDel(dao, obj, opts) {
        if (this._opt.onDel) {
            await this._opt.onDel(dao, obj, opts);
        }
    }
    async afterDel(dao, cnt, obj, opts) {
        if (this._opt.afterDel) {
            await this._opt.afterDel(dao, cnt, obj, opts);
        }
    }
    async onAddArray(dao, arr) {
        let opt = this._opt;
        let onAddArray = opt.onAddArray;
        if (onAddArray == null && opt.onAdd != null) {
            onAddArray = async function (dao, array) {
                for (let obj of array) {
                    await opt.onAdd(dao, obj);
                }
            };
        }
        if (onAddArray != null) {
            await onAddArray(dao, arr);
        }
    }
    async afterAddArray(dao, arr) {
        let opt = this._opt;
        let afterAddArray = opt.afterAddArray;
        if (afterAddArray != null) {
            await afterAddArray(dao, arr);
        }
    }
    async onUpdateArray(dao, array, other, whereObj) {
        let opt = this._opt;
        let onUpdateArray = opt.onUpdateArray;
        if (onUpdateArray == null && opt.onUpdate != null) {
            onUpdateArray = async function (dao, array, other) {
                for (let obj of array) {
                    await opt.onUpdate(dao, obj);
                }
            };
        }
        if (onUpdateArray != null) {
            await onUpdateArray(dao, array, other, whereObj);
        }
    }
    async afterUpdateArray(dao, cnt, array, other) {
        let opt = this._opt;
        let afterUpdateArray = opt.afterUpdateArray;
        if (afterUpdateArray != null) {
            await afterUpdateArray(dao, cnt, array, other);
        }
    }
    async onDelArray(dao, array, opts) {
        let opt = this._opt;
        let onDelArray = opt.onDelArray;
        if (onDelArray == null && opt.onDel != null) {
            onDelArray = async function (dao, array, other) {
                for (let obj of array) {
                    await opt.onDel(dao, obj);
                }
            };
        }
        if (onDelArray != null) {
            await onDelArray(dao, array, opts);
        }
    }
    async afterDelArray(dao, cnt, array, opts) {
        let opt = this._opt;
        let afterDelArray = opt.afterDelArray;
        if (afterDelArray != null) {
            await afterDelArray(dao, cnt, array, opts);
        }
    }
}
exports.default = DefOnChangeOpt;
