import {
  ERROR_SIZE_FILE_BIG,
  ERROR_TYPE_FILE,
  ERROR_EMPTY_FILE,
} from '@/errors/_constants';

export interface IFileValidator {
  file: any;

  getValidateFileType: (validType: string) => boolean;

  getValidateFileSize: (maxSize: number) => boolean;

  getFileTypeError: () => string;

  getFileSizeError: () => string;

  noFileError: () => string;
}

export class FileValidator implements IFileValidator {
  file: any;

  constructor(file: any) {
    this.file = file;
  }

  public getValidateFileType = (validType: string): boolean =>
    this.file.name.split('.')[1] === validType;

  public getValidateFileSize = (maxSize: number): boolean =>
    this.file.size && this.file.size <= maxSize;

  public getFileTypeError = () => ERROR_TYPE_FILE;

  public getFileSizeError = () => ERROR_SIZE_FILE_BIG;

  public noFileError = () => ERROR_EMPTY_FILE;
}
