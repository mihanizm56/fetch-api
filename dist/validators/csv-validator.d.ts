import { FileValidator } from './file-validator';
export declare class CSVValidator extends FileValidator {
    MAX_SIZE_CSV: number;
    FILE_TYPE: string;
    constructor(csvFile: any);
    validateFile: () => Promise<string>;
}
