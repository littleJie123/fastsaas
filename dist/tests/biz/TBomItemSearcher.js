"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Searcher_1 = __importDefault(require("../../searcher/Searcher"));
const Inquiry_1 = __importDefault(require("../../searcher/inquiry/imp/Inquiry"));
const Server_1 = __importDefault(require("../../context/decorator/Server"));
let TBomItemSearcher = class TBomItemSearcher extends Searcher_1.default {
    init(context) {
        this.reg('product', new Inquiry_1.default({ col: 'product_id' }));
    }
    getKey() {
        return 't_bom_item';
    }
    getProduct() {
        return this.get('product');
    }
};
TBomItemSearcher = __decorate([
    (0, Server_1.default)()
], TBomItemSearcher);
exports.default = TBomItemSearcher;
