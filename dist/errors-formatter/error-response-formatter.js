"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../constants/shared");
var ErrorResponseFormatter = /** @class */ (function () {
    function ErrorResponseFormatter() {
        var _this = this;
        this.getFormattedErrorTextResponse = function (_a) {
            var errorTextKey = _a.errorTextKey, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, errorTextData = _a.errorTextData, translateFunction = _a.translateFunction, statusCode = _a.statusCode;
            if (isErrorTextStraightToOutput) {
                return errorTextKey;
            }
            if (statusCode === 404) {
                return shared_1.NOT_FOUND_ERROR_KEY;
            }
            if (translateFunction) {
                return errorTextData
                    ? translateFunction(errorTextKey, errorTextData)
                    : translateFunction(errorTextKey);
            }
            // eslint-disable-next-line
            console.warn('no translateFunction is provided and it is not straight output');
            return shared_1.NETWORK_ERROR_KEY;
        };
        this.getFormattedErrorResponse = function (_a) {
            var errorDictionaryParams = _a.errorDictionaryParams, statusCode = _a.statusCode;
            var isAbortError = errorDictionaryParams.errorTextKey === shared_1.ABORTED_ERROR_TEXT_CHROME ||
                errorDictionaryParams.errorTextKey === shared_1.ABORTED_ERROR_TEXT_MOZILLA ||
                errorDictionaryParams.errorTextKey === shared_1.ABORTED_ERROR_TEXT_SAFARI;
            return {
                error: true,
                errorText: isAbortError
                    ? errorDictionaryParams.errorTextKey
                    : _this.getFormattedErrorTextResponse(errorDictionaryParams),
                data: {},
                additionalErrors: errorDictionaryParams.errorTextData || null,
                code: statusCode,
            };
        };
    }
    return ErrorResponseFormatter;
}());
exports.ErrorResponseFormatter = ErrorResponseFormatter;
