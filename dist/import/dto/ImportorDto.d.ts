interface ImportError {
    code?: string;
    msg?: string;
}
/**
 * 每个列的dto类
 */
interface ImportorDto {
    id?: number;
    name?: any;
    error?: string;
    dbId?: number;
    param?: any;
    errorMsg?: ImportError[];
}
export default ImportorDto;
