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
var types_1 = require("../types");
var error_response_formatter_1 = require("../errors-formatter/error-response-formatter");
var RestResponseFormatter = /** @class */ (function (_super) {
    __extends(RestResponseFormatter, _super);
    function RestResponseFormatter(_a) {
        var error = _a.error, translateFunction = _a.translateFunction, errorText = _a.errorText, additionalErrors = _a.additionalErrors, data = _a.data, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, statusCode = _a.statusCode;
        var _this = _super.call(this) || this;
        _this.getFormattedResponse = function () { return ({
            data: _this.data,
            error: _this.error,
            errorText: _this.errorText,
            additionalErrors: _this.additionalErrors,
            code: _this.statusCode,
        }); };
        _this.error = error || false;
        _this.translateFunction = translateFunction;
        _this.additionalErrors = additionalErrors;
        _this.data = data || {};
        _this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
        _this.statusCode = statusCode;
        _this.errorText = error
            ? new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorTextResponse({
                errorTextKey: errorText,
                translateFunction: translateFunction,
                isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                errorTextData: additionalErrors,
                statusCode: statusCode,
            })
            : '';
        return _this;
    }
    return RestResponseFormatter;
}(types_1.ResponseFormatter));
exports.RestResponseFormatter = RestResponseFormatter;
