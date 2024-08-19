"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TablesInquiry_1 = __importDefault(require("../../../searcher/inquiry/imp/TablesInquiry"));
class ProductInquiry extends TablesInquiry_1.default {
    async _findFromOtherSearcher(params) {
        let bomItemSearcher = this.getSearcher('tbomItem');
        return await bomItemSearcher.getProduct().find(params, 'material_id');
    }
}
exports.default = ProductInquiry;
