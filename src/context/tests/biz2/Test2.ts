import Server from './../../decorator/Server';
import Bean from './../../decorator/Bean';
import Test1 from "./Test1";

@Server()
export default class Test2{
    @Bean()
    private test1:Test1;
    test2(){
        return this.test1.test()+10
    }



   
}