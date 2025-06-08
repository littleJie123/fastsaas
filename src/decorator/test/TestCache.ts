import Cache from '../GetCache'
export default class testCache{
  private num:number;
  constructor(num:number){
    this.num = num;   
  }

  @Cache()
  async cal(num:number){
    return this.num + num;
  }
}