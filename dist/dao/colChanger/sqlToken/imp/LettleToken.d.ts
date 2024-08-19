import SqlToken from "../SqlToken";
export default class extends SqlToken {
    isEnd(c: string): boolean;
    change(pojoToDbMap: {
        [key: string]: string;
    }): string;
}
