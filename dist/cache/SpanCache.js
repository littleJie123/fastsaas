"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 一个根据范围查询的缓存
 */
class SpanCache {
    constructor(opt) {
        this.cacheMap = {};
        this.opt = opt;
    }
    _gte(a, b) {
        if (typeof a === 'string' && typeof b === 'string') {
            return parseInt(a, 10) >= parseInt(b, 10);
        }
        // @ts-ignore
        return a >= b;
    }
    _lt(a, b) {
        if (typeof a === 'string' && typeof b === 'string') {
            return parseInt(a, 10) < parseInt(b, 10);
        }
        // @ts-ignore
        return a < b;
    }
    _lte(a, b) {
        if (typeof a === 'string' && typeof b === 'string') {
            return parseInt(a, 10) <= parseInt(b, 10);
        }
        // @ts-ignore
        return a <= b;
    }
    _gt(a, b) {
        if (typeof a === 'string' && typeof b === 'string') {
            return parseInt(a, 10) > parseInt(b, 10);
        }
        // @ts-ignore
        return a > b;
    }
    /**
     * 首先判断参数和this.span是否存在间隙，需要调用opt.isAdjacent方法，
     * 如果存在间隙或者用重叠，则抛出异常。
     * 如果没有则将数据保存到缓存，并且更新this.span
     * @param span
     * @param datas
     */
    async saveToCache(param, datas, saveOpt) {
        if (!this.isCouldSave(param)) {
            if (!(saveOpt === null || saveOpt === void 0 ? void 0 : saveOpt.noError)) {
                throw new Error("您的参数不合法，不能合并");
            }
        }
        else {
            await this.updateCache(datas); // Only called if isCouldSave returns true
        }
    }
    isCouldSave(param) {
        // 如果没有缓存，则初始化缓存
        if (!this.span || this.span.begin === undefined || this.span.end === undefined) {
            this.span = { ...param }; // 深度复制param到this.span
            return true; // Initial save is always valid
        }
        // 确保opt.isAdjacent方法已提供，用于相邻性检查
        if (!this.opt.isAdjacent) {
            // As per user's request, return false for configuration error too
            return false;
        }
        const currentBegin = this.span.begin;
        const currentEnd = this.span.end;
        const newBegin = param.begin;
        const newEnd = param.end;
        // 检查类型一致性，以确保比较的有效性
        if ((currentBegin !== null && newBegin !== null && typeof currentBegin !== typeof newBegin) || (currentEnd !== null && newEnd !== null && typeof currentEnd !== typeof newEnd)) {
            return false; // Invalid parameter types
        }
        /**发生重叠 */
        const overlap = (currentEnd === null || newBegin === null || this._gte(currentEnd, newBegin)) &&
            (newEnd === null || currentBegin === null || this._gte(newEnd, currentBegin));
        if (overlap) {
            return false;
        }
        // 1. 检查是否为允许的相邻扩展
        if (newEnd !== null && currentBegin !== null && this.opt.isAdjacent(newEnd, currentBegin)) { // 新范围在当前范围之前相邻
            this.span.begin = newBegin;
            return true; // Valid adjacency
        }
        else if (currentEnd !== null && newBegin !== null && this.opt.isAdjacent(currentEnd, newBegin)) { // 新范围在当前范围之后相邻
            this.span.end = newEnd;
            return true; // Valid adjacency
        }
        // 3. 既不是允许的允许的相邻扩展，也不存在广义上的重叠，则意味着存在间隙
        return false; // Gap, not allowed
    }
    /**
     * 根据范围查询数据，如果传入的参数在缓存中（判断this.span 和param的差异）,
     * 则从缓存中读取数据并且拼装成一个大数组返回
     * 如果不在缓存中，则将param和this.span 比较得出差异的param，
     * 传递给opt.findFromDb方法进行查新（可能需要查询2次）
     * 最后将查询结果保存到cacheMap中并更新this.span
     *
     * @param param
     */
    async find(param) {
        // 1. 处理无缓存或缓存不完整的情况
        if (!this.span || this.span.begin === undefined || this.span.end === undefined) {
            const data = await this.opt.findFromDb(param);
            await this.updateCache(data);
            this.span = { ...param };
            return this.readFromCache(param);
        }
        // 2. 检查是否完全命中缓存
        const pBegin = param.begin;
        const pEnd = param.end;
        const sBegin = this.span.begin;
        const sEnd = this.span.end;
        const isBeginCovered = sBegin === null || (pBegin !== null && this._gte(pBegin, sBegin));
        const isEndCovered = sEnd === null || (pEnd !== null && this._lte(pEnd, sEnd));
        if (isBeginCovered && isEndCovered) {
            return this.readFromCache(param);
        }
        // 3. 处理部分命中或完全未命中的情况
        const spansToFetch = [];
        // 检查当前缓存范围之前是否需要拉取数据
        const needFetchBefore = (pBegin === null && sBegin !== null) || (pBegin !== null && sBegin !== null && this._lt(pBegin, sBegin));
        if (needFetchBefore) {
            spansToFetch.push({ begin: pBegin, end: sBegin });
        }
        // 检查当前缓存范围之后是否需要拉取数据
        const needFetchAfter = (pEnd === null && sEnd !== null) || (pEnd !== null && sEnd !== null && this._gt(pEnd, sEnd));
        if (needFetchAfter) {
            spansToFetch.push({ begin: sEnd, end: pEnd });
        }
        // 并行拉取所有需要的数据
        if (spansToFetch.length > 0) {
            const fetchPromises = spansToFetch.map(span => this.opt.findFromDb(span));
            const results = await Promise.all(fetchPromises);
            const newData = results.flat();
            await this.updateCache(newData);
        }
        // 更新缓存的范围为新的并集
        this.span = {
            begin: needFetchBefore ? pBegin : sBegin,
            end: needFetchAfter ? pEnd : sEnd,
        };
        // 缓存更新后，从中读取所需数据并返回
        return this.readFromCache(param);
    }
    async updateCache(data) {
        data.forEach(pojo => {
            const id = this.opt.getKeyFromPojo(pojo);
            this.cacheMap[id] = pojo; // Store Pojo directly, overwriting if ID exists
        });
    }
    async readFromCache(param) {
        const ids = this.opt.getKeysFromSpan(param); // These are Pojo IDs
        const result = [];
        ids.forEach(id => {
            if (this.cacheMap[id]) {
                result.push(this.cacheMap[id]); // Add the Pojo if it exists
            }
        });
        // The result array might contain duplicates if getKeysFromSpan returns duplicate IDs,
        // or if the same Pojo is requested multiple times.
        // Using a Set here is still a good idea to ensure the final returned array has unique Pojo objects.
        const resultSet = new Set(result);
        return Array.from(resultSet);
    }
}
exports.default = SpanCache;
