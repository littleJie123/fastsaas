"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事务注解
 */
function default_1() {
    return function (target, propertyName, property) {
        var fun = target[propertyName];
        target[propertyName] = async function () {
            let context = this._context;
            let transManager = null;
            if (context != null) {
                transManager = context.get('TransManager');
            }
            else {
                throw new Error('this._context为空，无法从上下文得到事件管理器');
            }
            var ret;
            try {
                if (transManager != null) {
                    console.log('begin ');
                    await transManager.beginTran();
                }
                ret = await fun.apply(this, arguments);
                if (transManager != null) {
                    console.log('commitTran ');
                    await transManager.commitTran();
                }
            }
            catch (e) {
                if (transManager != null) {
                    console.log('rollbackTran');
                    await transManager.rollbackTran();
                }
                throw e;
            }
            return ret;
        };
        return target;
    };
}
exports.default = default_1;
