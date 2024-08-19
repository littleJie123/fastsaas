"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
/**
 * 一个表的导入类
*/
class default_1 {
    constructor(opt) {
        this.opt = opt;
    }
    /**
     * 转变数据
     * @param data
     * @param caolMap
     */
    change(oldData, newData) {
        let opt = this.opt;
        let value = oldData[opt.key];
        if (value == null || value == '') {
            value = opt.defVal;
        }
        newData[opt.key] = { name: value };
    }
    async checked(context, param, datas) {
        let domainRet = await this.checkByDomain(context, param, datas);
        let daoRet = await this.checkByChecker(context, param, datas);
        return domainRet && daoRet;
    }
    /**
     * 通过dao类来进行处理
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    async checkByChecker(context, param, datas) {
        let checker = this.opt.checker;
        if (checker == null) {
            return true;
        }
        return checker(context, param, datas);
    }
    /**
     *
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    async checkByDomain(context, param, datas) {
        let noDomain = this.opt.noDomain;
        if (noDomain) {
            return true;
        }
        let domain = context.get(this.opt.key + 'Domain');
        if (domain === null || domain === void 0 ? void 0 : domain.onImportChecker) {
            return await domain.onImportChecker(param, datas, datas.map(row => this.parseDataToPojo(param, row)));
        }
        else {
            return true;
        }
    }
    /**
     * 处理导入
     * @param context
     * @param param
     * @param datas
     */
    async process(context, param, datas) {
        if (this.isAllNull(datas)) {
            return;
        }
        let ret = await this.processByDomain(context, param, datas);
        if (!ret) {
            await this.processByDao(context, param, datas);
        }
    }
    /**
     * 将需要导入的数据转成pojo
     * @param param
     * @param data
     * @returns
     */
    parseDataToPojo(param, data) {
        var _a, _b;
        let opt = this.opt;
        let retData = {};
        retData.name = data[opt.key].name;
        if (retData.name == null) {
            retData.name = opt.defVal;
        }
        if (param != null) {
            if (opt.paramKeys == null) {
                for (let e in param) {
                    retData[e] = param[e];
                }
            }
            else {
                for (let paramKey of opt.paramKeys) {
                    retData[paramKey] = param[paramKey];
                }
            }
        }
        let needId = this.opt.needId;
        if (needId != null) {
            for (let key of needId) {
                let col = this.getIdColByKey(key);
                retData[col] = (_a = data[key]) === null || _a === void 0 ? void 0 : _a.id;
            }
        }
        let otherColMap = this.opt.otherColMap;
        if (otherColMap != null) {
            for (let e in otherColMap) {
                retData[otherColMap[e]] = (_b = data[e]) === null || _b === void 0 ? void 0 : _b.name;
            }
        }
        return retData;
    }
    /**
     * 通过dao类来进行处理
     * @param context
     * @param param
     * @param datas
     * @returns
     */
    async processByDao(context, param, datas) {
        let dao = context.get(this.opt.key + 'Dao');
        if (dao != null) {
            let query = this.opt.query;
            if (query == null) {
                query = {
                    ...param,
                    isDel: 0
                };
            }
            else {
                query = fastsaas_1.BeanUtil.parseJsonFromParam(query, param);
            }
            let array = [];
            for (let data of datas) {
                array.push(this.parseDataToPojo(param, data));
            }
            array = array.filter(row => row.name != null);
            array = fastsaas_1.ArrayUtil.distinctByKey(array, 'name');
            let ret = await dao.onlyArray({
                query: {
                    name: fastsaas_1.ArrayUtil.toArray(array, 'name'),
                    ...query
                },
                mapFun: 'name',
                array,
                needUpdate: this.opt.needUpdate
            });
            this.join(datas, ret);
        }
    }
    /**
     * 将插入结果和内存中的数据进行关联，并且把id写进内存中的数据
     * @param datas
     * @param retArray
     * @returns
     */
    join(datas, retArray) {
        if (datas == null || retArray == null || retArray.length == 0) {
            return;
        }
        if (this.opt.noJoin) {
            return;
        }
        let key = this.opt.key;
        let self = this;
        fastsaas_1.ArrayUtil.joinArray({
            list2: datas,
            list: retArray,
            key2(row) {
                return row[key].name;
            },
            key: 'name',
            fun(retData, rows) {
                for (let row of rows) {
                    row[key].id = retData[self.getIdCol()];
                }
            }
        });
    }
    getIdCol() {
        return this.getIdColByKey(this.opt.key);
    }
    getIdColByKey(key) {
        return fastsaas_1.StrUtil.changeUnderStringToCamel(key) + 'Id';
    }
    /**
     * 如果domain中实现了onImport方法，则通过import方法来调用
     * @param context
     * @param param
     * @param datas
     */
    async processByDomain(context, param, datas) {
        let noDomain = this.opt.noDomain;
        if (noDomain) {
            return false;
        }
        let domain = context.get(this.opt.key + 'Domain');
        if (domain === null || domain === void 0 ? void 0 : domain.onImport) {
            let ret = await domain.onImport(param, datas, datas.map(row => this.parseDataToPojo(param, row)));
            this.join(datas, ret);
            return true;
        }
        return false;
    }
    getKey() {
        return this.opt.key;
    }
    /**
     * 该列所有对应的数据为空
     * @param datas
     * @returns
     */
    isAllNull(datas) {
        let key = this.opt.key;
        for (let data of datas) {
            if (data[key] != null && data[key].name != null) {
                return false;
            }
        }
        return true;
    }
    isReady(datas) {
        if (this.isAllNull(datas)) {
            return true;
        }
        let needId = this.opt.needId;
        if (needId != null) {
            for (let key of needId) {
                let allNull = true;
                let allNameNull = true;
                for (let data of datas) {
                    if (data[key] != null && data[key].name != null) {
                        allNameNull = false;
                    }
                    if (data[key] != null && data[key].id != null) {
                        allNull = false;
                        break;
                    }
                }
                if (!allNameNull && allNull) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.default = default_1;
