export default class extends Error {
    code?: string | number;
    constructor(message: string, code?: string | number);
}
