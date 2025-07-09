"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BeanConfig_1 = __importDefault(require("./bean/BeanConfig"));
const LogHelp_1 = __importDefault(require("../log/LogHelp"));
const ComponentBuilder_1 = __importDefault(require("./bean/ComponentBuilder"));
const AfterBuild = 'afterBuild'; //后处理函数
let spaceId = null;
let nowId = 0;
let randNum = Math.pow(2, 24);
let maxId = randNum;
function getContextId() {
    let ret = null;
    if (spaceId == null) {
        spaceId = Math.floor(Math.random() * randNum) * randNum;
    }
    ret = spaceId + nowId;
    nowId++;
    if (nowId >= maxId) {
        nowId = 0;
    }
    return ret;
}
/**
 * bean 上下午相关的结构
 * {
 *  __need:['beanId1','beanId2']
 * }
 * 上下文类
 */
class Context {
    constructor() {
        this._componentId = 0;
        /**
         * 放bean缓存
         */
        this._map = {};
        this._data = {};
        /**
         * builder 的缓存
         */
        this._builderMap = {};
    }
    setSessionId(val) {
        this.sessionId = val;
    }
    /**
     *
     * @param componentId 组件容器的id
     * @param clazz
     * @param beanId
     */
    regComponent(componentId, clazz, beanId, key) {
        if (beanId == null) {
            beanId = 'comp_' + (this._componentId++);
        }
        if (key == null)
            key = beanId;
        beanId = this._parseBeanId(beanId);
        this.regClazz(beanId, clazz);
        let cb = this._builderMap[componentId];
        if (cb == null) {
            cb = new ComponentBuilder_1.default();
            this.regBuilder(componentId, cb);
        }
        cb.add(key, beanId);
    }
    setData(key, val) {
        this._data[key] = val;
        return this;
    }
    getData(key) {
        return this._data[key];
    }
    /**
     * 构建一个对象
     * @param beanId
     */
    getBuilder(beanId) {
        return this._builderMap[beanId];
    }
    buildChild() {
        let context = new Context();
        context._parent = this;
        return context;
    }
    _parseBeanId(beanId) {
        beanId = beanId.toLowerCase();
        if (beanId.indexOf('_') != -1) {
            var strs = beanId.split('_');
            beanId = strs.join('');
        }
        return beanId;
    }
    get(beanId) {
        if (beanId != null)
            beanId = this._parseBeanId(beanId);
        var map = this._map;
        let bean = map[beanId];
        if (bean != null) {
            return bean;
        }
        let parent = this._parent;
        if (parent == null || parent.getBuilder(beanId) == null) {
            return null;
        }
        return this._reg(beanId);
    }
    _reg(beanId) {
        //查询各类依赖
        let beanList = this._doReg([beanId]);
        this._assembly(beanList);
        return this._map[beanId];
    }
    /**
     * 找到build，并且在map中存放
     * 返回没有注册的依赖类
     */
    _doReg(beanIdList) {
        let list = [];
        while (beanIdList.length > 0) {
            for (let beanId of beanIdList) {
                list.push(this._buildAndSave(beanId));
            }
            beanIdList = this._findNoRegNeed(beanIdList);
        }
        return list;
    }
    /**
     * 查询没有注册的又需要依赖的id
     * @param beanIdList
     */
    _findNoRegNeed(beanIdList) {
        let map = this._map;
        let retMap = {};
        var list = [];
        for (let beanId of beanIdList) {
            var bean = this._map[beanId];
            if (bean != null && bean.getBeanConfig$$) {
                var beanConfig = bean.getBeanConfig$$();
                let needs = beanConfig.getNeeds();
                for (let needbeanId of needs) {
                    if (map[needbeanId] == null) {
                        retMap[needbeanId] = true;
                    }
                }
            }
        }
        for (var id in retMap) {
            list.push(id);
        }
        return list;
    }
    _buildAndSave(beanId) {
        let parent = this._parent;
        if (parent == null) {
            throw new Error('父类的context为空，必须从父类buildChild出来了');
        }
        var builder = parent.getBuilder(beanId);
        if (builder == null) {
            var msg = (`${beanId}没有注册构造器`);
            throw new Error(msg);
        }
        var bean = builder.build(this);
        if (bean == null) {
            var msg = `${beanId}的构造器没有构造出实例`;
            throw new Error(msg);
        }
        if (bean.getBeanConfig$$ == null) {
            if (bean.__beanConfig != null) {
                bean.getBeanConfig$$ = function () {
                    return this.__beanConfig;
                };
            }
            else {
                let beanConfig = new BeanConfig_1.default();
                bean.getBeanConfig$$ = function () {
                    return beanConfig;
                };
            }
        }
        this._map[beanId] = bean;
        return bean;
    }
    /**
     * 装配
     * @param beans
     */
    assembly(beans) {
        var map = {};
        //得到所有的依赖列表
        for (let bean of beans) {
            if (bean.getBeanConfig$$) {
                let beanConfig = bean.getBeanConfig$$();
                let needsMap = beanConfig.getNeedsMap();
                for (let beanId in needsMap) {
                    map[beanId] = true;
                }
            }
        }
        for (var e in map) {
            this.get(e); //保证依赖包都在缓存中
        }
        this._assembly(beans);
    }
    /**
     * 装配属性
     * @param beans
     */
    _assembly(beans) {
        let map = this._map;
        for (let bean of beans) {
            if (bean.getBeanConfig$$ != null) {
                let beanConfig = bean.getBeanConfig$$();
                if (beanConfig.isAssembly()) {
                    continue;
                }
                let needsMap = beanConfig.getNeedsMap();
                for (let beanId in needsMap) {
                    beanConfig.assembly(bean, beanId, map[needsMap[beanId]]);
                }
                if (bean[AfterBuild]) { //执行创建后操作
                    bean[AfterBuild](this);
                }
                beanConfig.setAssembly(true);
            }
        }
    }
    /**
     * 注册父类的builder
     */
    regParentBuilder(beanId, builder) {
        if (this._parent == null) {
            throw new Error('父context不存在');
        }
        return this._parent.regBuilder(beanId, builder);
    }
    regParentBuilderByClazz(beanId, clazz) {
        if (this._parent == null) {
            throw new Error('父context不存在');
        }
        this.regParentBuilder(beanId, {
            build(context) {
                var ins = new clazz();
                if (ins.setContext)
                    ins.setContext(context);
                return ins;
            }
        });
    }
    regBuilder(beanId, builder) {
        if (beanId != null)
            beanId = this._parseBeanId(beanId);
        this._builderMap[beanId] = builder;
    }
    regClazz(beanId, clazz) {
        if (clazz.__needReg == 'single') {
            this.regBuilder(beanId, {
                build(context) {
                    if (this._ins == null) {
                        this._ins = new clazz();
                    }
                    return this._ins;
                }
            });
        }
        else {
            this.regBuilder(beanId, {
                build(context) {
                    var ins = new clazz();
                    if (ins.setContext)
                        ins.setContext(context);
                    return ins;
                }
            });
        }
    }
    /**
     * 合并两个context
     * @param context
     */
    combine(context) {
        var map = context._builderMap;
        var builderMap = this._builderMap;
        for (var e in map) {
            builderMap[e] = map[e];
        }
        return this;
    }
    /**
     * 返回日志处理器
     */
    getLogger(category) {
        if (category == null)
            category = 'server';
        let logger = new LogHelp_1.default();
        logger.setContextId(this.getId());
        logger.setSessionId(this.sessionId);
        logger.setCategory(category);
        return logger;
    }
    getId() {
        if (this._id == null) {
            this._id = getContextId();
        }
        return this._id;
    }
    setId(context_id) {
        this._id = context_id;
        return this._id;
    }
}
exports.default = Context;
/**
 * 日志配置
 */
const LOGCONF = 'logConf';
