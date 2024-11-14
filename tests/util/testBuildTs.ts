import {FileUtil} from '../../src/fastsaas';
import fs from 'fs';
import path from 'path'
let filePath = 'D:/jswork/taropkg/src'; 
let indexFile = 'index.ts'
it('buildTs',()=>{
  let array:string[] = [];
  FileUtil.each(filePath,(src:string)=>{
    let curFile = src.substring(filePath.length + 1);
    
    
    
    if(curFile != indexFile ){
      let info = path.parse(src);
      console.log('info.ext',info.ext);
      if(['.ts','.tsx'].includes(info.ext)){
        array.push(`export { default as ${info.name}} from "./${curFile.substring(0,curFile.length-info.ext.length)}"`)
      }
    }
    
    
  })
  console.log('array',array);
  fs.writeFileSync(`${filePath}/${indexFile}`,array.join('\r\n'))

})