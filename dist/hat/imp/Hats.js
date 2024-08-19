"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseHat_1 = __importDefault(require("../BaseHat"));
const Hat_1 = __importDefault(require("./Hat"));
class Hats extends BaseHat_1.default {
    getKeys() {
        let opt = this._opt;
        return opt.keys;
    }
    getHatsClazz() {
        let opt = this._opt;
        return opt.hatsClazz;
    }
    buildHatsParam() {
        let context = this.getContext();
        return {
            context,
            fun: this._fun
        };
    }
    getHats() {
        let hatsClazz = this.getHatsClazz();
        let context = this.getContext();
        if (hatsClazz != null) {
            return hatsClazz.map((clazz) => {
                return new clazz(this.buildHatsParam());
            });
        }
        let keys = this.getKeys();
        return keys.map((key) => {
            return new Hat_1.default({
                context,
                key,
                fun: this._fun
            });
        });
    }
    async process(list) {
        let hats = this.getHats();
        /*
        let array = [];
        for(let hat of hats){
            array.push(hat.process(list));
        }
        await Promise.all(array);*/
        for (let hat of hats) {
            await hat.process(list);
        }
        return list;
    }
}
exports.default = Hats;
