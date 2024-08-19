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
const KeysInquiry_1 = __importDefault(require("../../searcher/inquiry/imp/KeysInquiry"));
const Inquiry_1 = __importDefault(require("../../searcher/inquiry/imp/Inquiry"));
const Server_1 = __importDefault(require("../../context/decorator/Server"));
let ProductSearcher = class ProductSearcher extends Searcher_1.default {
    init(context) {
        this.reg('findProductMenu', new Inquiry_1.default({
            col: 'product_menu_id',
            otherCdt: {
                is_del: 0
            }
        }));
        this.reg('findProductMenuNo', new KeysInquiry_1.default({
            keys: ['product_no', 'product_menu_id'],
            otherCdt: {
                is_del: 0
            }
        }));
        this.reg('findStore', new Inquiry_1.default({
            col: 'store_id',
            otherCdt: {
                is_del: 0
            }
        }));
    }
    getKey() {
        return 'product';
    }
    async findStore(pmIds, col) {
        return await this.get('findStore').find(pmIds, col);
    }
    findProductMenu(pmIds, col) {
        return this.get('findProductMenu').find(pmIds, col);
    }
    findProductMenuNo(params, col) {
        return this.get('findProductMenuNo').find(params, col);
    }
};
ProductSearcher = __decorate([
    (0, Server_1.default)()
], ProductSearcher);
exports.default = ProductSearcher;
