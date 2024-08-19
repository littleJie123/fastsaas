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
const KeysInquiry_1 = __importDefault(require("../../searcher/inquiry/imp/KeysInquiry"));
const Server_1 = __importDefault(require("../../context/decorator/Server"));
const ProductInquiry_1 = __importDefault(require("./inquiry/ProductInquiry"));
const ClazzUtil_1 = __importDefault(require("../../util/ClazzUtil"));
let TMaterialSearcher = class TMaterialSearcher extends Searcher_1.default {
    getKey() {
        return "TMaterial";
    }
    getIdKey() {
        return 'id';
    }
    init(context) {
        this.reg('brand', ClazzUtil_1.default.combine(new Inquiry_1.default({
            col: 'brand_id',
            otherCdt: { is_del: 0 }
        }), {
            _findDefDatas(array) {
                var list = [];
                for (var brand_id of array) {
                    list.push({ brand_id, name: '默认物料' });
                }
                return list;
            }
        }));
        this.reg('name', new Inquiry_1.default({
            col: 'name'
        }));
        this.reg('brandName', new KeysInquiry_1.default({
            keys: ['brand_id', 'name']
        }));
        this.reg('product', new ProductInquiry_1.default());
    }
    getBrand() {
        return this.get('brand');
    }
    getBrandName() {
        return this.get('brandName');
    }
    getProduct() {
        return this.get('product');
    }
};
TMaterialSearcher = __decorate([
    (0, Server_1.default)()
], TMaterialSearcher);
exports.default = TMaterialSearcher;
