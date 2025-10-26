type IGeter<Pojo=any> = string|((pojo:Pojo)=>any)|string[];

export type IGeterValue<Pojo=any> = string|((pojo:Pojo)=>any);

export default IGeter