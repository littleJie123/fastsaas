import path from 'path'
import FileContext from '../FileContext'
import OrderFactory from './biz/OrderFactory';
import Test1 from './biz2/Test1';

var context = new FileContext();
context.loadFromPath(path.join(__dirname,'./biz2'))
let childContext = context.buildChild()
function run(){
    
    let test1:Test1 = childContext.get('test1');
    console.log(test1.test1())
}
run(); 
