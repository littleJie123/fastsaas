import initContext from './initContext'
import ProductDao from './biz/TProductDao';
async function  run(){
    let context = initContext();
    let dao:ProductDao = context.get('productDao');
    await dao.updateArray([
        {product_id:1},
        {product_id:2}
    ],{attr_rewrite:null })
    
}
run();