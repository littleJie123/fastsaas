
import {ArrayUtil} from './ArrayUtil';
import fs from "fs";
import readline from "readline";

import {StrUtil} from "./StrUtil";

interface Col{
    title: string;
    dataIndex: string;
}


function parseStr(str){
    return StrUtil.replace(str,'""','"');
}
function doParse(str:string,list:string[]){
    str = StrUtil.trim(str);
    if(str == '' || str == null)
        return;
    
    let first = str.substring(0,1);
    if(first == '"'){
        let last  = str.indexOf('"',1);
        while(last<str.length-1 && str.substring(last+1,last+2)=='"'){
            last = str.indexOf('"',last+2);
        }
        if(last == -1){
            list.push(parseStr(str));
            return;
        }else{
            list.push(parseStr(str.substring(1,last)))
            if(last<str.length-1){
                doParse(str.substring(last+2),list)
            }
        }
    }else{
        let next = str.indexOf(',')
        if(next == -1){
            list.push(str)
            return;
        }
        if(next ==0){
            list.push('');    
        }else{
            list.push(parseStr(str.substring(0,next)))
            
        }
        if(next<str.length){
            doParse(str.substring(next+1),list);
        }
    }
}
function parse(str:string):string[]{
    let list = [];
    doParse(str,list)
    return list;
}

export default class {

    static async parseFromFile(filePath:string){
        let stream = fs.createReadStream(filePath);
        let rl = readline.createInterface({
            input:stream
        })
        let list = []
        for await(const line of rl){
            list.push(line);
        }
        let retArray = this.parseCsv(list);
        return this.parseColInRow(retArray)
        
    }
    static parse(str:string):string[]{
        return parse(str);
    }

    /**
     *  parse 一列，把数组转成一行
     * @param array 
     * @returns 
     */
    private static  parseColInRow(array:any[]){
        for(let row of array){
            for(let e in row){
                if(row[e].length == 1)
                    row[e] = row[e][0]
            }
        }
        return array;
    }
    /**
     * 将一个csv格式的字符串列表 转成一个json格式的数据
     * @param list 
     */
    static parseCsv(list:string[]):any[]{
        let retArray = [];
        let firstRow = list[0];
        if(firstRow != null){
            let cols = parse(firstRow)
            for(let i=1;i<list.length;i++){
                let map:any= {};
                let datas = parse(list[i]);
                for(let t = 0;t<datas.length;t++){
                    let col = cols[t];
                    if(col != null){
                        let array = map[col];
                        if(array == null){
                            array = [];
                            map[col]=array;
                        }
                        array.push(datas[t]);
                    }
                    
                }
                retArray.push(map);
            }
        }
        return retArray;
    }
    /**
     * 将一个json数组转成符合csv格式的buffer
     * @param datas 
     * @param cols 
     * @returns 
     */
    static toBuffer(datas:any[],cols:Col[]):Buffer{
        let array = [];
        array.push(this._attachArray(ArrayUtil.toArray(cols,'title')));
        for (let i = 0; i < datas.length; i++) {
            let row = datas[i];
            
            let dataArray = [];
            for(let col of cols){
                dataArray.push(row[col.dataIndex])
            }
            array.push(this._attachArray(dataArray));
            
        }
        let str = array.join('\r\n');
        let dataBuffer = Buffer.concat([Buffer.from('\xEF\xBB\xBF', 'binary'), Buffer.from(str)]);
        return dataBuffer;
    }
    private static _attachArray  (list:any[]) {
        if (list == null) return null;
        let array = [];
        for (let i = 0; i < list.length; i++) {
          let str = list[i];
          if (str == null) str = '';
          str = str.toString();
          str = StrUtil.replace(str, '"', '""');
          array.push('"' + str + '"');
        }
        return array.join(',');
    }
}