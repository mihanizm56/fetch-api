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
var omit_1 = require("../utils/omit");
var JSONRPCResponseFormatter = /** @class */ (function (_super) {
    __extends(JSONRPCResponseFormatter, _super);
    function JSONRPCResponseFormatter(_a) {
        var error = _a.error, result = _a.result, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, translateFunction = _a.translateFunction, statusCode = _a.statusCode;
        var _this = _super.call(this) || this;
        _this.getAdditionalErrors = function (error) {
            if (error && error.data) {
                // omit trKey from other errors - this will be in errorText
                var formattedErrorData = omit_1.getOmittedObject({
                    key: 'trKey',
                    object: error.data,
                });
                // if there are no keys in error data - only trKey
                if (!Object.keys(formattedErrorData).length) {
                    return null;
                }
                return formattedErrorData;
            }
            return null;
        };
        _this.getFormattedResponse = function () { return ({
            errorText: _this.error
                ? new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorTextResponse({
                    errorTextKey: _this.isErrorTextStraightToOutput
                        ? _this.error.message
                        : _this.error.data.trKey,
                    translateFunction: _this.translateFunction,
                    isErrorTextStraightToOutput: _this.isErrorTextStraightToOutput,
                    errorTextData: _this.error.data,
                    statusCode: _this.statusCode,
                })
                : '',
            error: Boolean(_this.error),
            data: _this.result || {},
            additionalErrors: _this.getAdditionalErrors(_this.error),
            code: _this.statusCode,
        }); };
        _this.result = result;
        _this.error = error;
        _this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
        _this.translateFunction = translateFunction;
        _this.statusCode = statusCode;
        return _this;
    }
    return JSONRPCResponseFormatter;
}(types_1.ResponseFormatter));
exports.JSONRPCResponseFormatter = JSONRPCResponseFormatter;
