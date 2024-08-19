import SqlToken from "../SqlToken";
export default class extends SqlToken {
    change(pojoToDbMap: {
        [key: string]: string;
    }): string;
    isEnd(c: string): boolean;
}
