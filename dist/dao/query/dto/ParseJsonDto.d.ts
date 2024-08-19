export default interface ParseJsonDto {
    cdts?: CdtDto[];
    query?: any;
    having?: CdtDto[];
    cols?: string[];
    group?: string[];
    size?: number;
    orders?: any[];
}
import CdtDto from './CdtDto';
