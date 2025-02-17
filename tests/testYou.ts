import readline from "readline";
/**
 * 读取用户的输入
 * @param prompt 
 * @returns 
 */
function getUserInput(prompt:string):Promise<number> {
  return new Promise((resolve) => {
      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
      });

      rl.question(prompt, (input) => {
          rl.close();
          resolve(parseFloat(input));
      });
  });
}
/**
 * 计算三角形面积
 */
async function main(){
  let aaa = await getUserInput('请输入您的年龄：');
  if(aaa<=6){
    console.log('小屁孩，你不用买票')
  }else{
    let aaa = await getUserInput('票价为30，您要买几张票：');
    console.log('一共需要付款：',aaa*30);
  }
  
  
}
main()