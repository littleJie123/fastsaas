"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapNameHat {
    constructor(opt) {
        this.opt = opt;
    }
    process(list) {
        for (let row of list) {
            let value = this.opt.map[row[this.opt.col]];
            if (this.opt.fun) {
                this.opt.fun(row, value);
            }
            else {
                row[this.opt.col + 'Name'] = value;
            }
        }
    }
}
exports.default = MapNameHat;
