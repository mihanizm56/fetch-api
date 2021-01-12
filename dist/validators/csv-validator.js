"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var file_validator_1 = require("./file-validator");
var CSVValidator = /** @class */ (function (_super) {
    __extends(CSVValidator, _super);
    function CSVValidator(csvFile) {
        var _this = _super.call(this, csvFile) || this;
        _this.MAX_SIZE_CSV = 12 * Math.pow(10, 7);
        _this.FILE_TYPE = 'csv';
        _this.validateFile = function () {
            return new Promise(function (resolve) {
                if (Boolean(_this.file)) {
                    var isFileTypeCSV = _this.getValidateFileType(_this.FILE_TYPE);
                    var isFileNotBigger = _this.getValidateFileSize(_this.MAX_SIZE_CSV);
                    if (!isFileTypeCSV) {
                        resolve(_this.getFileTypeError());
                    }
                    if (!isFileNotBigger) {
                        resolve(_this.getFileSizeError());
                    }
                    resolve('');
                }
                resolve(_this.noFileError());
            });
        };
        _this.file = csvFile;
        return _this;
    }
    return CSVValidator;
}(file_validator_1.FileValidator));
exports.CSVValidator = CSVValidator;
