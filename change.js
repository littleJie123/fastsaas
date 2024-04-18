const fs = require("fs");
const path = require('path');
let indexArray = [];
let map = {};
let needMap = {
    "StrUtil":true,
    "ArrayUtil":true,
    "DateUtil":true,
    "BeanUtil":true,
    "TimezoneUtil":true,
    "RowUtil":true
}
function cachFile(filePath){
    const fileName = path.basename(filePath, path.extname(filePath)); // 获取不带扩展名的文件名
    const fileExt = path.extname(filePath);
    if(fileExt != null && fileExt.toLowerCase() ==".ts") {
        
        map[fileName] = filePath;
    }
}
function traverseDirectory(currentPath,fileFun,dirFun) {
    const files = fs.readdirSync(currentPath); // 读取当前目录下的所有文件和文件夹

    files.forEach(file => {
        const filePath = path.join(currentPath, file); // 获取文件的完整路径

        const stats = fs.statSync(filePath); // 获取文件信息

        if (stats.isFile()) {
            fileFun(filePath);
        } else if (stats.isDirectory()) {
            if(dirFun){
                dirFun(filePath)
            }
            traverseDirectory(filePath,fileFun); // 递归遍历子目录
        }
    });
}
function change(filePath){
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let array = [];
    for(let i=0;i<lines.length;i++){
        
        let line = lines[i];
        if(line != null){
            let begin = line.indexOf('{');
            let end = line.indexOf('}');
            if(begin !=-1 && end !=-1 
                && (
                    line.indexOf('@dt/itachi')!=-1 
                    || line.indexOf('/orm')!=-1
                    || line.indexOf('/core')!=-1
                    || line.indexOf('/control')!=-1
                )){

               
                let names = line.substring(begin+1,end);
                let nameArray = names.split(",");
                for(let name of nameArray){
                    name = name.trim();
                    let filepathOfName = map[name]; 
                    if(filepathOfName){
                        filepathOfName = path.relative(path.dirname(filePath),filepathOfName);
                        filepathOfName = filepathOfName.replace(/\\/g, '/');
                        filepathOfName = filepathOfName.substring(0,filepathOfName.length-3);
                        if(!filepathOfName.substring(0,1)!='.'){
                            filepathOfName = './'+filepathOfName
                        }
                        if(needMap[name]){
                            name = "{"+name+"}";
                        }
                        array.push(`import ${name} from '${filepathOfName}';`)
                    }
                } 
            }else{
                array.push(line);
            }
        }
    } 
    fs.writeFileSync(filePath,array.join('\n'));
}
function writeFile(filePath){
    let relativePath = path.relative(path.join(__dirname,'./src'),filePath);
    relativePath = relativePath.replace(/\\/g, '/');
    relativePath = './' + relativePath.substring(0,relativePath.length-3);
    const fileExt = path.extname(filePath);
     
    const fileName = path.basename(filePath, path.extname(filePath)); // 获取不带扩展名的文件名

    if(fileExt != null && fileExt.toLowerCase()==".ts"){
        
        if(relativePath.indexOf("/test/") == -1 
            && relativePath.indexOf("/tests/") == -1
            && !relativePath.endsWith("index")){
            if(needMap[fileName]){
                indexArray.push(`export {${fileName}} from '${relativePath}';`);
            }else{
                indexArray.push(`export {default as ${fileName}} from '${relativePath}';`);
            }
        }
    }
    
    
}
//traverseDirectory(path.join(__dirname,"./src"),cachFile);
//traverseDirectory(path.join(__dirname,"./src"),change)
traverseDirectory(path.join(__dirname,"./src"),writeFile,()=>indexArray.push(''))
fs.writeFileSync(path.join(__dirname,'./src/index.ts'),indexArray.join('\n'));