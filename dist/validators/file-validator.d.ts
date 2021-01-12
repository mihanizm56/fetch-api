export interface IFileValidator {
    file: any;
    getValidateFileType: (validType: string) => boolean;
    getValidateFileSize: (maxSize: number) => boolean;
    getFileTypeError: () => string;
    getFileSizeError: () => string;
    noFileError: () => string;
}
export declare class FileValidator implements IFileValidator {
    file: any;
    constructor(file: any);
    getValidateFileType: (validType: string) => boolean;
    getValidateFileSize: (maxSize: number) => boolean;
    getFileTypeError: () => string;
    getFileSizeError: () => string;
    noFileError: () => string;
}
