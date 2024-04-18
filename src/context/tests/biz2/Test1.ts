import Test2 from './Test2'
import Server from './../../decorator/Server';
import Bean from './../../decorator/Bean';

@Server()
export default class Test1{
    @Bean()
    private test2:Test2;
    test1(){
        return this.test2.test2()+100;
    }

    test():number{
        return 1
    }
}
