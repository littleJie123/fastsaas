import Server from './../../decorator/Server';
import Bean from './../../decorator/Bean';
import AbsOrder from "./AbsOrder";

@Server()
export default class OrderFactory{
    @Bean('订单')
    private absOrderMap:Map<string,AbsOrder>;
    
    test(type:string){
        console.log('11111111');
        
        this.absOrderMap.get(type).test()
    }
}