"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _constants_1 = require("./_constants");
var FileValidator = /** @class */ (function () {
    function FileValidator(file) {
        var _this = this;
        this.getValidateFileType = function (validType) {
            return _this.file.name.split('.')[1] === validType;
        };
        this.getValidateFileSize = function (maxSize) {
            return _this.file.size && _this.file.size <= maxSize;
        };
        this.getFileTypeError = function () { return _constants_1.ERROR_TYPE_FILE; };
        this.getFileSizeError = function () { return _constants_1.ERROR_SIZE_FILE_BIG; };
        this.noFileError = function () { return _constants_1.ERROR_EMPTY_FILE; };
        this.file = file;
    }
    return FileValidator;
}());
exports.FileValidator = FileValidator;
