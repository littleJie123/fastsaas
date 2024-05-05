import {Router} from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import {StrUtil} from '../../util/StrUtil';
import Context from '../../context/Context';



/**
 截取mocker
*/

function createFun(clazz,opt):Function{
    if(clazz.default​​){
        //兼容ts的export
        clazz = clazz.default;
    }
    
    return function(req,resp){

        
        var ctrl = new clazz();
        if(opt.context){
            var context:Context = opt.context;

            var childContext = context.buildChild();
            if(ctrl.setContext){
                ctrl.setContext(childContext);
            }
            // fix 如果req.headers.context_id不是数字,则忽略掉
            if (req.headers.context_id != null && !isNaN(req.headers.context_id)) {
                
                childContext.setId(req.headers.context_id);
                
                
            }
             
            childContext.setSessionId(  req?.headers?.session_id)
            childContext.assembly([ctrl]);
        }
        ctrl.execute(req,resp);
    }
}
function loadFromWebPath(app,opt){
    if(opt.webPath == null)
        return;
    var map = {};
    function _get(key){
        var router = map[key];
        if(router == null){
            router = Router();
            map[key] = router;
        }
        return router;
    }

    /**
     * 构建路由
     * @param dirPath 
     * @param webPath 
     */
    function buildRouter(dirPath:string,webPath:string){
        let extName = path.extname(dirPath)
        if( extName == '.js' || (extName == '.ts' && dirPath.indexOf('.d.')==-1)){
            var clazz = require(dirPath)
            if(clazz.default){
                clazz = clazz.default;
            }
            var routerName = clazz.router;
            if(routerName) {
                if(routerName.length > 0 && routerName[0] !== '/') {
                    routerName = '/' + routerName
                }
            } else {
                let routerPath = path.relative(webPath,dirPath);
                routerPath = routerPath.substring(0,routerPath.length-3);
                routerPath = StrUtil.replace(routerPath,'\\','/')
                routerName = '/'+routerPath
            }

            app.all(routerName,createFun(clazz,opt));    
        }
    }
    /**
     * 
     * @param dir 目录名
     * @param upDir 上层路径
     * @param webPath web的根目录
     * @returns 
     */
    function _parseDir(dir:string,upDir:string,webPath:string){
        /**得到全路径 */
        var dirPath = path.join(upDir,dir);
        var stat = fs.statSync(dirPath)
        if (stat.isFile()) {
            buildRouter(dirPath,webPath);
        } else {
            var files = fs.readdirSync(dirPath)
            for (var file of files) {
                _parseDir(file,dirPath,webPath);
            }
        } 
    }
    var dirs = fs.readdirSync(opt.webPath)
    for(var dir of dirs){
        _parseDir(dir,opt.webPath,opt.webPath)
    }

}



//自动生成
function loadRouter(app, opt){
    loadFromWebPath(app,opt);
}
export default loadRouter;
  

