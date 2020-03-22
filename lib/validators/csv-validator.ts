import { FileValidator } from './file-validator';

export class CSVValidator extends FileValidator {
  MAX_SIZE_CSV = 12 * 10 ** 7;

  FILE_TYPE = 'csv';

  constructor(csvFile: any) {
    super(csvFile);

    this.file = csvFile;
  }

  public validateFile = (): Promise<string> =>
    new Promise(resolve => {
      if (Boolean(this.file)) {
        const isFileTypeCSV = this.getValidateFileType(this.FILE_TYPE);
        const isFileNotBigger = this.getValidateFileSize(this.MAX_SIZE_CSV);

        if (!isFileTypeCSV) {
          resolve(this.getFileTypeError());
        }

        if (!isFileNotBigger) {
          resolve(this.getFileSizeError());
        }

        resolve('');
      }

      resolve(this.noFileError());
    });
}
